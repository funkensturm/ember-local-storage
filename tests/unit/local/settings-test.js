import Ember from 'ember';
import { module, test } from 'qunit';
import {
  storageDeepEqual
} from '../../helpers/storage';

import Settings from 'dummy/models/settings';

var settings;

module('localeStorage - settings', {
  beforeEach: function() {
    Ember.run(function() {
      settings = Settings.create();
    });
  },
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(settings.get('_storage'), 'local');
  assert.equal(settings.get('storageKey'), 'settings');
  assert.deepEqual(settings.get('initialContent'), {
    welcomeMessageSeen: false
  });
});


test('it saves changes to localStorage', function(assert) {
  assert.expect(3);

  assert.ok(window.localStorage);
  storageDeepEqual(assert, window.localStorage.settings, {
    welcomeMessageSeen: false
  });

  Ember.run(function() {
    settings.set('welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage.settings, {
    welcomeMessageSeen: true
  });
});

test('it updates when change events fire', function(assert) {
  assert.expect(3);

  assert.equal(settings.get('changeFired'), undefined);
  window.dispatchEvent(new window.StorageEvent('storage', {
    key: 'settings',
    newValue: '{"welcomeMessageSeen":false,"changeFired":true}',
    oldValue: '{"welcomeMessageSeen":false}',
    storageArea: settings.storage()
  }));
  assert.equal(settings.get('welcomeMessageSeen'), false);
  assert.equal(settings.get('changeFired'), true);
});
