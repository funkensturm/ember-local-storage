import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage';
import { action } from '@ember/object';

export default class extends Controller {
  @storageFor('settings') settings;

  @action toggleWelcomeMessage() {
    this.settings.set('welcomeMessageSeen', !this.settings.get('welcomeMessageSeen'));
  }
}
