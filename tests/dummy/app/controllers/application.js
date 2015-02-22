import Ember from 'ember';
import Settings from 'dummy/models/settings';

export default Ember.Controller.extend({
  settings: Settings.create(),

  actions: {
    hideWelcomeMessage: function() {
      this.set('settings.welcomeMessageSeen', true);
    }
  }
});