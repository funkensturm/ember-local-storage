import DS from 'ember-data';

export function initialize(/* container, application */) {

  // Monkeypatch the store until ED gives us a good way to listen to push events
  if (!DS.Store.prototype._emberLocalStoragePatched) {
    DS.Store.reopen({
      _emberLocalStoragePatched: true,
      import: function(types) {
        const adapter = this.adapterFor(types[0]);
        return adapter.import.apply(adapter, arguments);
      },
      export: function(types) {
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
