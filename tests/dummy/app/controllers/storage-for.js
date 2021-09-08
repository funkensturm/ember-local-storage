import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage';

export default Controller.extend({
  settings: storageFor('settings'),

  actions: {
    toggleWelcomeMessage() {
      this.toggleProperty('settings.welcomeMessageSeen');
    },
  },
});
