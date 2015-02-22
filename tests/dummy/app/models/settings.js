import StorageObject from 'ember-local-storage/local/object';

export default StorageObject.extend({
  storageKey: 'settings',
  initialContent: {
    welcomeMessageSeen: false
  }
});