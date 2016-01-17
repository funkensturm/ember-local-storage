import Ember from 'ember';
import { storageFor } from 'ember-local-storage/helpers/storage';

export default Ember.Controller.extend({
  settings: storageFor('settings'),

  actions: {
    hideWelcomeMessage() {
      this.set('settings.welcomeMessageSeen', true);
    }
  }
});