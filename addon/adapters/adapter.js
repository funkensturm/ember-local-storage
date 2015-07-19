import Ember from 'ember';
import DS from 'ember-data';
import { getStorage } from '../lib/helpers';
import StorageArray from '../local/array';

const get = Ember.get;

const {
  merge
} = Ember;

const {
  JSONAPIAdapter
} = DS;

export default JSONAPIAdapter.extend({
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

  ajax() {
    return this._handleStorageRequest.apply(this, arguments);
  },

  _handleStorageRequest(url, type, options) {
    if (this._debug) {
      console.log(url, type, options);
    }

    return new Ember.RSVP.Promise((resolve) => {
      let data;

      if (type === 'GET') {
        data = this._handleGETRequest(url);
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

      Ember.run(null, resolve, {data: data});
    }, 'DS: LocalStorageAdapter#_handleRequest ' + type + ' to ' + url);
  },

  _handleGETRequest(url) {
    const { type, id } = this._urlParts(url);
    const storage = get(this, '_storage'),
      storageKey = this._storageKey(type, id);

    if (id) {
      return storage[storageKey] ? JSON.parse(storage[storageKey]) : null;
    } else {
      return this._getIndex(type)
        .map(function(storageKey) {
          return JSON.parse(storage[storageKey]);
        });
    }
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
  },

  import(json, options) {
    // merge defaults
    options = merge({
      json: true,
      truncate: true
    }, options || {});

    let content = options.json ? JSON.parse(json) : json;

    if (options.truncate) {
      content.data.forEach((record) => {
        const type = record.type;

        this._getIndex(type).forEach((storageKey) => {
          delete get(this, '_storage')[storageKey];
        });

        this._getIndex(type).reset();
      });
    }

    content.data.forEach((record) => {
      this._handlePOSTRequest({data: record});
    });
  },

  export(types, options) {
    let json,
      data = types.reduce((records, type) => {
        const url = this.buildURL(type),
          data = this._handleGETRequest(url);

        records.data = records.data.concat(data);
        return records;
      }, {data: []});

    // merge defaults
    options = merge({
      json: true,
      download: false,
      filename: 'ember-data.json'
    }, options || {});

    if (options.json || options.download) {
      json = JSON.stringify(data);
    }

    if (options.json) {
      data = json;
    }

    if (options.download) {
      window.saveAs(
        new Blob([json], {type: 'application/json;charset=utf-8'}),
        options.filename
      );
    }

    return data;
  }
});
