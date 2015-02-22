import Ember from 'ember';
import {
  test
} from 'ember-qunit';

import Settings from 'dummy/models/settings';

var settings;

module('localeStorage - deprecation', {
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it throws a deprecation', function() {
  expect(1);

  throws(function() {
    Ember.run(function() {
      settings = Settings.create({
        localStorageKey: 'test'
      });
    });
  }, new Error('Usage of localStorageKey is deprecated use storageKey instead.'));
});