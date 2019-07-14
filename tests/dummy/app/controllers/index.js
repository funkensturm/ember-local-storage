import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage/helpers/storage';

export default Controller.extend({
  stats: storageFor('stats'),

  actions: {
    countUp() {
      this.incrementProperty('stats.counter');
    },
    resetCounter() {
      this.get('stats').reset();
    }
  }
});