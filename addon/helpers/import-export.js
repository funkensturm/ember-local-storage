import { all, Promise } from 'rsvp';
import { assign, merge } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { singularize } from 'ember-inflector';
import { A } from '@ember/array';

const assignIt = assign || merge;

export function importData(store, content, options) {
  // merge defaults
  options = assignIt({
    json: true,
    truncate: true
  }, options || {});

  let truncateTypes = A(),
    reloadTypes = A();

  content = options.json ? JSON.parse(content) : content;

  if (options.truncate) {
    content.data.forEach((record) => {
      truncateTypes.addObject(record.type);
    });

    truncateTypes.forEach((type) => {
      const singularType = singularize(type);
      const adapter = store.adapterFor(singularType);

      adapter._getIndex(type).forEach((storageKey) => {
        delete adapter._storage[storageKey];
      });

      adapter._getIndex(type).reset();

      // unload from store
      store.unloadAll(singularType);
    });
  }

  const promises = content.data.map((record) => {
    const adapter = store.adapterFor(singularize(record.type));

    // collect types to reload
    reloadTypes.addObject(singularize(record.type));

    return adapter._handleStorageRequest(null, 'POST', {
      data: { data: record },
    });
  });

  return all(promises).then(function () {
    // reload from store
    reloadTypes.forEach(function (type) {
      store.findAll(type);
    });
  });
}

export function exportData(store, types, options) {
  // merge defaults
  options = assignIt({
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
