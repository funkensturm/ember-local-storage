import DS from 'ember-data';

export function initialize() {
  if (!DS.Store.prototype._emberLocalStoragePatched) {
    DS.Store.reopen({
      _emberLocalStoragePatched: true,
      importData: function(types) {
        // TODO Fix we need a type to get the right adapter
        const adapter = this.adapterFor(types[0]);
        return adapter.import.apply(adapter, arguments);
      },
      exportData: function(types) {
        const adapter = this.adapterFor(types[0]);
        return adapter.export.apply(adapter, arguments);
      }
    });
  }
}

export default {
  name: 'local-storage-adapter',
  after: 'ember-data',
  initialize: initialize
};
