import Route from '@ember/routing/route';
import { storageFor } from 'ember-local-storage';
import { get } from '@ember/object';

export default class extends Route {
  @storageFor('stats') stats;
  @storageFor('settings') settings;

  activate() {
    this.stats.counter = this.stats.get('counter') + 1;

    // setup a user
    if (!this.settings.get('userId')) {
      this.store
        .createRecord('user', {name: 'Me'})
        .save()
        .then((user) => {
          get(this, 'settings').set('userId', user.get('id'));
        });
    }
  }
}
