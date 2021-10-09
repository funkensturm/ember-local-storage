import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage/helpers/storage';
import { action } from '@ember/object';
import { get } from '@ember/object';

export default class extends Controller {
  @storageFor('stats') stats;

  @action countUp() {
    this.stats.set('counter', this.stats.get('counter') + 1);
  }

  @action resetCounter() {
    get(this, 'stats').reset();
  }
}
