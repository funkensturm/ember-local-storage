import Ember from 'ember';
import DS from 'ember-data';
import ImportExportMixin from '../mixins/adapters/import-export';
import ArrayProxyMixin from '../mixins/array';
import { createStorage } from '../helpers/storage';

const keys = Object.keys || Ember.keys;

const {
  JSONAPIAdapter
} = DS;

const {
  get,
  RSVP,
  run,
  typeOf,
  isEmpty,
  computed
} = Ember;

// Ember data ships with ember-inflector
import { singularize, pluralize } from 'ember-inflector';

export default JSONAPIAdapter.extend(ImportExportMixin, {
  _debug: false,
  _indices: computed(function() { return {}; }),
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
          store.push({data: null});
          return {data: result || null};
        } catch(e) {
          return {data: result || []};
        }
      });
  },

  // Delegate to _handleStorageRequest
  ajax() {
    return this._handleStorageRequest.apply(this, arguments);
  },

  // Delegate to _handleStorageRequest
  makeRequest(request) {
    return this._handleStorageRequest(
      request.url,
      request.method,
      { data: request.data }
    );
  },

  // Work arround ds-improved-ajax Feature Flag
  _makeRequest() {
    return this.makeRequest.apply(this, arguments);
  },

  // Remove the ajax() deprecation warning
  _hasCustomizedAjax() {
    return false;
  },

  // Delegate to _handle${type}Request
  _handleStorageRequest(url, type, options = {}) {
    if (this._debug) {
      console.log(url, type, options); // eslint-disable-line no-console
    }

    return new RSVP.Promise((resolve, reject) => {
      const handler = this[`_handle${type}Request`];
      if (handler) {
        handler.call(this, url, options.data).then((data) => {
          run(null, resolve, {data: data});
        }).catch((err) => {
          run(null, reject, err);
        });
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
      return storage.getItem(storageKey).then((record) => {
        if (record === null || record === undefined) {
          throw this.handleResponse(404, {}, 'Not found', { url, method: 'GET' });
        }
        return record;
      });
    }

    const recordPromise = this._getIndex(type).then((index) => {
      return index.map((storageKey) => {
        return storage.getItem(storageKey);
      });
    }).then((promises) => {
      return RSVP.all(promises);
    }).then((records) => {
      return records.filter((record) => {
        return record !== null && record !== undefined;
      });
    });

    if (query && query.filter) {
      const serializer = this.store.serializerFor(singularize(type));
      return recordPromise.then((records) => {
        return records.filter((record) => {
          return this._queryFilter(record, serializer, query.filter);
        });
      });
    }
    return recordPromise;
  },

  _handlePOSTRequest(url, record) {
    const { type, id } = record.data;
    const storage = get(this, '_storage');
    const storageKey = this._storageKey(type, id);

    return this._addToIndex(type, storageKey).then(() => {
      return storage.setItem(storageKey, record.data);
    });
  },

  _handlePATCHRequest(url, record) {
    const { type, id } = record.data;
    const storage = get(this, '_storage');
    const storageKey = this._storageKey(type, id);

    return this._addToIndex(type, storageKey).then(() => {
      return storage.setItem(storageKey, record.data);
    });
  },

  _handleDELETERequest(url) {
    const { type, id } = this._urlParts(url);
    const storage = get(this, '_storage');
    const storageKey = this._storageKey(type, id);

    return this._removeFromIndex(type, storageKey).then(() => {
      return storage.removeItem(storageKey);
    });
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
          queryValue = pluralize(queryValue);
        }

        // Attributes
        if (key === 'id' || key === 'type') {
          recordValue = data[key];
        } else {
          key = serializer.keyForAttribute(key);
          recordValue = data.attributes ? data.attributes[key] : undefined;
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

  _createIndex(type) {
    // Inherit index storage type from storage type
    // i.e. this._storage._storageType
    const storage = get(this, '_storage');
    const storageType = storage._storageType;
    const IndexArrayType = Ember.ArrayProxy.extend(ArrayProxyMixin, {
      _storageType: storageType
    });
    return createStorage(this, null, null, {}, IndexArrayType, `index-${type}`);
  },

  _storageKey(type, id) {
    return `${type}-${id}`;
  },

  _getIndex(type) {
    const indices = get(this, '_indices');

    if (!indices[type]) {
      indices[type] = this._createIndex(type);
    }

    return indices[type];
  },

  _indexHasKey(type, id) {
    return this._getIndex(type).then((index) => {
      return index.indexOf(id) >= 0;
    });
  },

  _addToIndex(type, id) {
    return this._indexHasKey(type, id).then((hasKey) => {
      if (!hasKey) {
        this._getIndex(type).then((index) => {
          index.addObject(id);
        })
      }
    });
  },

  _removeFromIndex(type, id) {
    return this._getIndex(type).then((index) => {
      return index.removeObject(id);
    })
  }
});
