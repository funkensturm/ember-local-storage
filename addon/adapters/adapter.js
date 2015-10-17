import Ember from 'ember';
import DS from 'ember-data';
import { getStorage } from '../helpers/storage';
import StorageArray from '../local/array';
import ImportExportMixin from '../mixins/adapters/import-export';

const get = Ember.get;
const keys = Object.keys || Ember.keys;

const {
  JSONAPIAdapter
} = DS;

const {
  Inflector,
  typeOf
} = Ember;

// Ember data ships with ember-inflector
const inflector = Inflector.inflector;

// TODO const Adapter = JSONAPIAdapter || RESTAdapter;
const Adapter = JSONAPIAdapter;

export default Adapter.extend(ImportExportMixin, {
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
              record.destroyRecord({test: 'moin'});
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
        return {data: result.data[0]};
      });
  },

  ajax() {
    return this._handleStorageRequest.apply(this, arguments);
  },

  _handleStorageRequest(url, type, options = {}) {
    if (this._debug) {
      console.log(url, type, options);
    }

    return new Ember.RSVP.Promise((resolve) => {
      let data;

      if (type === 'GET') {
        data = this._handleGETRequest(url, options.data);
      }

      if (type === 'POST') {
        data = this._handlePOSTRequest(options.data);
      }

      if (type === 'PATCH') {
        data = this._handlePATCHRequest(options.data);
      }

      if (type === 'DELETE') {
        data = this._handleDELETERequest(url);
      }

      // TODO make it work for RESTAdapter
      Ember.run(null, resolve, {data: data});
    }, 'DS: LocalStorageAdapter#_handleRequest ' + type + ' to ' + url);
  },

  _handleGETRequest(url, query) {
    const { type, id } = this._urlParts(url);
    const storage = get(this, '_storage'),
      storageKey = this._storageKey(type, id);

    if (id) {
      return storage[storageKey] ? JSON.parse(storage[storageKey]) : null;
    }

    const records = this._getIndex(type)
      .map(function(storageKey) {
        return JSON.parse(storage[storageKey]);
      });

    if (query && query.hasOwnProperty('filter')) {
      return records.filter((record) => {
        return this._queryFilter(record, query.filter);
      });
    }

    return records;
  },

  _handlePOSTRequest(record) {
    const { type, id } = record.data;
    const storageKey = this._storageKey(type, id);

    this._addToIndex(type, storageKey);
    get(this, '_storage')[storageKey] = JSON.stringify(record.data);

    return null;
  },

  _handlePATCHRequest(record) {
    const { type, id } = record.data;
    const storageKey = this._storageKey(type, id);

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

  _queryFilter(record, query = {}) {
    return keys(query).every((key) => {
      const queryValue = query[key];

      // Attributes
      const recordValue = (key === 'id') ? record[key] : record.attributes[key];

      if (recordValue) {
        return this._matches(recordValue, queryValue);
      }

      // Relationships
      if (record.relationships && record.relationships[key]) {
        const relationship = record.relationships[key].data,
          queryValueType = typeOf(queryValue);

        // belongsTo
        if (typeOf(relationship) === 'object') {
          if (queryValueType === 'object') {
            return this._matchesObject(relationship, queryValue);
          } else if (queryValueType === 'array') {
            // error
          } else {
            return this._matches(relationship.id, queryValue);
          }
        // hasMany
        } else {
          if (queryValueType === 'object') {
            return relationship.some((record) => {
              return this._matchesObject(record, queryValue);
            });
          } else if (queryValueType === 'array') {
            return queryValue.every((queryValue) => {
              return relationship.some((record) => {
                return this._matchesObject(record, queryValue);
              });
            });
          } else {
            return relationship.some((record) => {
              return this._matches(record.id, queryValue);
            });
          }
        }

        return false;
      }
    });
  },

  _matchesObject(recordValue, queryValue) {
    return keys(queryValue).every((key) => {
      let value = queryValue[key];

      // pluralize type
      if (key === 'type' && typeOf(value) === 'string') {
        value = inflector.pluralize(value);
      }

      return this._matches(recordValue[key], value);
    });
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

    return {
      type: parts.shift(),
      id: parts.shift()
    };
  },

  _storageKey(type, id) {
    return type + '-' + id;
  },

  _getIndex(type) {
    const indices = get(this, '_indices');

    if (!indices[type]) {
      indices[type] = StorageArray
        .extend({storageKey: 'index-' + type})
        .create();
    }

    return indices[type];
  },

  _addToIndex(type, id) {
    this._getIndex(type).addObject(id);
  },

  _removeFromIndex(type, id) {
    this._getIndex(type).removeObject(id);
  }
});
