import Route from '@ember/routing/route';
import { storageFor } from 'ember-local-storage';

export default Route.extend({
  stats: storageFor('stats'),
  settings: storageFor('settings'),

  activate() {
    this.incrementProperty('stats.counter');

    // setup a user
    if (!this.get('settings.userId')) {
      this.store
        .createRecord('user', {name: 'Me'})
        .save()
        .then((user) => {
          this.set('settings.userId', user.get('id'));
        });
    }
  }
});

