import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

const {
  Route
} = Ember;

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

