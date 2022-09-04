import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { storageFor } from 'ember-local-storage';

export default class extends Route {
  @service store;
  @storageFor('stats') stats;
  @storageFor('settings') settings;

  activate() {
    this.incrementCounter();

    // setup a user
    if (!this.settings.get('userId')) {
      this.store
        .createRecord('user', { name: 'Me' })
        .save()
        .then((user) => {
          this.settings.set('userId', user.get('id'));
        });
    }
  }

  incrementCounter() {
    let newValue = this.stats.get('counter') + 1;
    this.stats.set('counter', newValue);
  }
}
