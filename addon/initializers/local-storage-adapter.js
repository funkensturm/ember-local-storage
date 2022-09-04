import DS from 'ember-data';
import {
  importData,
  exportData,
} from 'ember-local-storage/helpers/import-export';

export function initialize() {
  if (!DS.Store.prototype._emberLocalStoragePatched) {
    DS.Store.reopen({
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
