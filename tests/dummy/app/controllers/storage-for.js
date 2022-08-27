import Controller from '@ember/controller';
import { action } from '@ember/object';
import { storageFor } from 'ember-local-storage';

export default class extends Controller {
  @storageFor('settings') settings;

  @action
  toggleWelcomeMessage() {
    let newValue = !this.settings.get('welcomeMessageSeen');
    this.settings.set('welcomeMessageSeen', newValue);
  }
}
