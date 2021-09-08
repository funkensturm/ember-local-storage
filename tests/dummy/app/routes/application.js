import Route from '@ember/routing/route';
import { storageFor } from 'ember-local-storage';

export default class extends Route {
  @storageFor('stats') stats;
  @storageFor('settings') settings;

  activate() {
    this.stats.counter = this.stats.get('counter') + 1;

    // setup a user
    if (!this.settings.get('userId')) {
      this.store
        .createRecord('user', { name: 'Me' })
        .save()
        .then((user) => {
          this.set('settings.userId', user.get('id'));
        });
    }
  }
}
