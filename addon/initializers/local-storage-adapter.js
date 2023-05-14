import { deprecate } from '@ember/debug';
import Store from '@ember-data/store';
import {
  importData,
  exportData,
} from 'ember-local-storage/helpers/import-export';

export function initialize() {
  if (!Store.prototype._emberLocalStoragePatched) {
    deprecate(
      'The initializer has been deprecated and will be removed in version 3.0.0. Find more information how to remove that deprecation by visiting the url.',
      false,
      {
        for: 'ember-local-storage',
        id: 'ember-local-storage.initializers.local-storage-adapter',
        since: '2.0.5',
        until: '3.0.0',
        url: 'https://github.com/funkensturm/ember-local-storage#deprecations',
      }
    );
    Store.reopen({
      _emberLocalStoragePatched: true,
      importData: function (json, options) {
        return importData(this, json, options);
      },
      exportData: function (types, options) {
        return exportData(this, types, options);
      },
    });
  }
}

export default {
  name: 'local-storage-adapter',
  after: 'ember-data',
  initialize: initialize,
};
