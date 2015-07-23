import StorageObject from 'ember-local-storage/local/object';

export default StorageObject.extend({
  storageKey: 'details',
  initialContent: {
    address: {
      first: null,
      second: null,
      anotherProp: null
    }
  }
});