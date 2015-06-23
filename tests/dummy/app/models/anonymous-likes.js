import Ember from 'ember';
import StorageArray from 'ember-local-storage/local/array';

export default StorageArray.extend({
  storageKey: 'anonymous-likes',
  initialContent: Ember.A()
});
