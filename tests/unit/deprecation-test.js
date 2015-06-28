import Ember from 'ember';
import { module, test } from 'qunit';

import Settings from 'dummy/models/settings';

var settings;

module('localeStorage - deprecation', {
  beforeEach: function() {
  },
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it throws a deprecation', function(assert) {
  assert.expect(1);

  assert.throws(function() {
    Ember.run(function() {
      settings = Settings.create({
        localStorageKey: 'test'
      });
    });
  }, new Error('Usage of localStorageKey is deprecated use storageKey instead.'));
});
