import DS from 'ember-data';
import Adapter from 'ember-local-storage/adapters/adapter';

export function initialize() {
  if (!DS.Store.prototype._emberLocalStoragePatched) {
    const adapter = Adapter.create();

    DS.Store.reopen({
      _emberLocalStoragePatched: true,
      importData: function(json, options) {
        return adapter.importData.call(adapter, this, json, options);
      },
      exportData: function(types, options) {
        return adapter.exportData.call(adapter, this, types, options);
      }
    });
  }
}

export default {
  name: 'local-storage-adapter',
  after: 'ember-data',
  initialize: initialize
};
