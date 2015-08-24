import Ember from 'ember';

const get = Ember.get;

const {
  Mixin,
  String: {
    singularize
  },
  merge
} = Ember;

export default Mixin.create({
  importData(store, content, options) {
    // merge defaults
    options = merge({
      json: true,
      truncate: true
    }, options || {});

    let reloadTypes = [];

    content = options.json ? JSON.parse(content) : content;

    if (options.truncate) {
      content.data.forEach((record) => {
        const type = record.type;

        this._getIndex(type).forEach((storageKey) => {
          delete get(this, '_storage')[storageKey];
        });

        this._getIndex(type).reset();

        // unload from store
        store.unloadAll(singularize(type));
      });
    }

    const promises = content.data.map((record) => {
      // collect types to reload
      reloadTypes.push(singularize(record.type));

      return this._handleStorageRequest(null, 'POST', {
        data: {data: record}
      });
    });

    return Ember.RSVP.all(promises)
      .then(function() {
        // reload from store
        reloadTypes.forEach(function(type) {
          store.findAll(type);
        });
      });
  },

  exportData(store, types, options) {
    // merge defaults
    options = merge({
      json: true,
      download: false,
      filename: 'ember-data.json'
    }, options || {});

    let json, data;

    // collect data
    data = types.reduce((records, type) => {
      const url = this.buildURL(type),
        exportData = this._handleGETRequest(url);

      records.data = records.data.concat(exportData);
      return records;
    }, {data: []});

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

    return new Ember.RSVP.Promise((resolve) => {
      Ember.run(null, resolve, data);
    }, 'DS: LocalStorageAdapter#exportData');
  }
});