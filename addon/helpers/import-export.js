import { all, Promise } from 'rsvp';
import { assign, merge } from '@ember/polyfills';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { singularize } from 'ember-inflector';

const assign = assign || merge;

export function importData(store, content, options) {
  // merge defaults
  options = assign({
    json: true,
    truncate: true
  }, options || {});

  let reloadTypes = [];

  content = options.json ? JSON.parse(content) : content;

  if (options.truncate) {
    content.data.forEach((record) => {
      const type = record.type;
      const adapter = store.adapterFor(singularize(type));

      adapter._getIndex(type).forEach((storageKey) => {
        delete get(adapter, '_storage')[storageKey];
      });

      adapter._getIndex(type).reset();

      // unload from store
      store.unloadAll(singularize(type));
    });
  }

  const promises = content.data.map((record) => {
    const adapter = store.adapterFor(singularize(record.type));

    // collect types to reload
    reloadTypes.push(singularize(record.type));

    return adapter._handleStorageRequest(null, 'POST', {
      data: {data: record}
    });
  });

  return all(promises)
    .then(function() {
      // reload from store
      reloadTypes.forEach(function(type) {
        store.findAll(type);
      });
    });
}

export function exportData(store, types, options) {
  // merge defaults
  options = assign({
    json: true,
    download: false,
    filename: 'ember-data.json'
  }, options || {});

  let json, data;

  // collect data
  data = types.reduce((records, type) => {
    const adapter = store.adapterFor(singularize(type));
    const url = adapter.buildURL(type),
      exportData = adapter._handleGETRequest(url);

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

  return new Promise((resolve) => {
    run(null, resolve, data);
  }, 'DS: LocalStorageAdapter#exportData');
}
