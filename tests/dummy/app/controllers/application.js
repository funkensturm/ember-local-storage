import Ember from 'ember';
import { storageFor } from 'ember-local-storage/helpers/storage';

export default Ember.Controller.extend({
  stats: storageFor('stats'),

  actions: {
    countUp() {
      this.incrementProperty('stats.counter');
    },
    resetCounter() {
      this.get('stats').clear();

      // this.set('stats.counter', 0);
    }
  }
});