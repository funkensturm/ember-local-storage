import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
  settings: storageFor('settings'),

  actions: {
    hideWelcomeMessage() {
      this.toggleProperty('settings.welcomeMessageSeen');
    },
    showWelcomeMessage() {
      this.set('settings.welcomeMessageSeen', false);
    },
  }
});