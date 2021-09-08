import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage/helpers/storage';
import { action } from '@ember/object';

export default class extends Controller {
  @storageFor('stats') stats;

  @action countUp() {
    this.stats.counter = this.stats.counter + 1;
  }

  @action resetCounter() {
    this.stats.reset();
  }
}
