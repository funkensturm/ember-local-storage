import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
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

test('it has correct defaults', function() {
  expect(3);

  equal(settings.get('_storage'), 'local');
  equal(settings.get('storageKey'), 'settings');
  deepEqual(settings.get('initialContent'), {
    welcomeMessageSeen: false
  });
});


// test('it saves changes to localStorage', function() {
//   expect(3);
//
//   ok(window.localStorage);
//   storageDeepEqual(window.localStorage.settings, {
//     welcomeMessageSeen: false
//   });
//
//   Ember.run(function() {
//     settings.set('welcomeMessageSeen', true);
//   });
//
//   storageDeepEqual(window.localStorage.settings, {
//     welcomeMessageSeen: true
//   });
// });