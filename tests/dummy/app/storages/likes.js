import Ember from 'ember';
import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend();

Storage.reopenClass({
  initialState() {
    return Ember.A(['1234']);
  }
});

export default Storage;