import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return {
      apiToken: null,
      welcomeMessageSeen: false
    };
  }
});

export default Storage;