import Ember from 'ember';
import { storageFor } from 'ember-local-storage/helpers/storage';

export default Ember.Controller.extend({
  postStats: storageFor('stats', 'model'),

  actions: {
    countUp() {
      this.incrementProperty('postStats.counter');
    },
    resetCounter() {
      this.set('postStats.counter', 0);
    }
  }
});