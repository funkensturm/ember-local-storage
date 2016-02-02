import Ember from 'ember';
import DS from 'ember-data';
import { getStorage } from '../helpers/storage';
import StorageArray from '../local/array';
import ImportExportMixin from '../mixins/adapters/import-export';

const keys = Object.keys || Ember.keys;

const {
  JSONAPIAdapter
} = DS;

const {
  get,
  RSVP,
  run,
  Inflector,
  typeOf,
  isEmpty
} = Ember;

// Ember data ships with ember-inflector
const inflector = Inflector.inflector;

export default JSONAPIAdapter.extend(ImportExportMixin, {
  _debug: false,
  _storage: getStorage('local'),
  _indices: {},
  isNewSerializerAPI: true,
  coalesceFindRequests: false,

  // Reload behavior
  shouldReloadRecord() { return true; },
  shouldReloadAll() { return true; },
  shouldBackgroundReloadRecord() { return true; },
  shouldBackgroundReloadAll() { return true; },

  generateIdForRecord() {
    return Math.random().toString(32).slice(2).substr(0, 8);
  },

  // Relationship sugar
  createRecord(store, type, snapshot) {
    snapshot.eachRelationship(function(name, relationship) {
      const {
        kind,
        options
      } = relationship;

      if (kind === 'belongsTo' && options.autoSave) {
        snapshot.record.get(name)
          .then(function(record) {
            if (record) {
              record.save();
            }
          });
      }
    });

    return this._super.apply(this, arguments);
  },

  deleteRecord(store, type, snapshot) {
    snapshot.eachRelationship(function(name, relationship) {
      const {
        kind,
        options
      } = relationship;

      if (kind === 'hasMany' && options.dependent === 'destroy') {
        snapshot.record.get(name)
          .then(function(records) {
            records.forEach(function(record) {
              record.destroyRecord();
            });
          });
      }

      if (kind === 'belongsTo' && options.autoSave) {
        snapshot.record.get(name)
          .then(function(record) {
            if (record) {
              record.save();
            }
          });
      }
    });

    return this._super.apply(this, arguments);
  },

  // Polyfill queryRecord
  queryRecord(store, type, query) {
    let records = this._super.apply(this, arguments);

    if (!records) {
      var url = this.buildURL(type.modelName, null, null, 'queryRecord', query);

      if (this.sortQueryParams) {
        query = this.sortQueryParams(query);
      }

      records = this.ajax(url, 'GET', { data: query });
    }

    return records
      .then(function(result) {
        result = result.data[0];
        // hack to fix https://github.com/emberjs/data/issues/3790
        // and https://github.com/emberjs/data/pull/3866
        try {
          store._pushInternalModel(null);
          return {data: result || null};
        } finally {
          return {data: result || []};
        }
      });
  },

  // Delegate to _handleStorageRequest
  ajax() {
    return this._handleStorageRequest.apply(this, arguments);
  },

  // Delegate to _handle${type}Request
  _handleStorageRequest(url, type, options = {}) {
    if (this._debug) {
      console.log(url, type, options);
    }

    return new RSVP.Promise((resolve, reject) => {
      const handler = this[`_handle${type}Request`];
      if (handler) {
        const data = handler.call(this, url, options.data);
        run(null, resolve, {data: data});
      } else {
        run(
          null,
          reject,
          `There is nothing to handle _handle${type}Request`
        );
      }
    }, 'DS: LocalStorageAdapter#_handleStorageRequest ' + type + ' to ' + url);
  },

  _handleGETRequest(url, query) {
    const { type, id } = this._urlParts(url);
    const storage = get(this, '_storage'),
      storageKey = this._storageKey(type, id);

    if (id) {
      return storage[storageKey] ? JSON.parse(storage[storageKey]) : null;
    }

    const records = this._getIndex(type)
      .filter(function(storageKey) {
        return storage[storageKey];
      })
      .map(function(storageKey) {
        return JSON.parse(storage[storageKey]);
      });

    if (query && query.filter) {
      const serializer = this.store.serializerFor(inflector.singularize(type));

      return records.filter((record) => {
        return this._queryFilter(record, serializer, query.filter);
      });
    }

    return records;
  },

  _handlePOSTRequest(url, record) {
    const { type, id } = record.data;
    const storageKey = this._storageKey(type, id);

    this._addToIndex(type, storageKey);
    get(this, '_storage')[storageKey] = JSON.stringify(record.data);

    return null;
  },

  _handlePATCHRequest(url, record) {
    const { type, id } = record.data;
    const storageKey = this._storageKey(type, id);

    this._addToIndex(type, storageKey);
    get(this, '_storage')[storageKey] = JSON.stringify(record.data);

    return null;
  },

  _handleDELETERequest(url) {
    const { type, id } = this._urlParts(url);
    const storageKey = this._storageKey(type, id);

    this._removeFromIndex(type, storageKey);
    delete get(this, '_storage')[storageKey];

    return null;
  },

  _queryFilter(data, serializer, query = {}) {
    const queryType = typeOf(query),
      dataType = typeOf(data);

    if (queryType === 'object' && dataType === 'object') {
      return keys(query).every((key) => {
        let queryValue = query[key],
          recordValue;

        // normalize type
        if (key === 'type' && typeOf(queryValue) === 'string') {
          queryValue = inflector.pluralize(queryValue);
        }

        // Attributes
        if (key === 'id' || key === 'type') {
          recordValue = data[key];
        } else {
          key = serializer.keyForAttribute(key);
          recordValue = data.attributes ? data.attributes[key] : null;
        }

        if (recordValue !== undefined) {
          return this._matches(recordValue, queryValue);
        }

        // Relationships
        key = serializer.keyForRelationship(key);
        if (data.relationships && data.relationships[key]) {
          if (isEmpty(data.relationships[key].data)) {
            return;
          }

          return this._queryFilter(
            data.relationships[key].data,
            serializer,
            queryValue
          );
        }
      });
    } else if (queryType === 'array') {
      // belongsTo
      if (dataType === 'object') {
        const queryMessage = query.map(function(item) {
          return keys(item).map(function(key) {
            return key + ': ' + item[key];
          });
        }).join(', ');

        throw new Error(
          'You can not provide an array with a belongsTo relation. ' +
          'Query: ' + queryMessage
        );

      // hasMany
      } else {
        return query.every((queryValue) => {
          return this._queryFilter(data, serializer, queryValue);
        });
      }
    } else {
      // belongsTo
      if (dataType === 'object') {
        return this._matches(data.id, query);

      // hasMany
      } else {
        return data.some((record) => {
          return this._queryFilter(record, serializer, query);
        });
      }
    }
  },

  _matches(recordValue, queryValue) {
    if (typeOf(queryValue) === 'regexp') {
      return queryValue.test(recordValue);
    }

    return recordValue === queryValue;
  },

  _urlParts(url) {
    const parts = url.split('/');

    // remove empty part
    parts.shift();

    let type = parts.shift();
    let id = parts.shift();

    if (type === this.modelNamespace) {
      type = `${type}/${id}`;
      id = parts.shift();
    }

    return {
      type: type,
      id: id
    };
  },

  _storageKey(type, id) {
    return type + '-' + id;
  },

  _getIndex(type) {
    const indices = get(this, '_indices');

    if (!indices[type]) {
      indices[type] = StorageArray
        .extend({ _storageKey: 'index-' + type })
        .create();
    }

    return indices[type];
  },

  _indexHasKey(type, id) {
    return this._getIndex(type).indexOf(id) !== -1;
  },

  _addToIndex(type, id) {
    if (!this._indexHasKey(type, id)) {
      this._getIndex(type).addObject(id);
    }
  },

  _removeFromIndex(type, id) {
    this._getIndex(type).removeObject(id);
  }
});
