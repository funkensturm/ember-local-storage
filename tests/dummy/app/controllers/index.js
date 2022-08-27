import Controller from '@ember/controller';
import { action } from '@ember/object';
import { storageFor } from 'ember-local-storage/helpers/storage';

export default class extends Controller {
  @storageFor('stats') stats;

  @action
  countUp() {
    let newValue = this.stats.get('counter') + 1;
    this.stats.set('counter', newValue);
  }

  @action
  resetCounter() {
    this.stats.reset();
  }
}
