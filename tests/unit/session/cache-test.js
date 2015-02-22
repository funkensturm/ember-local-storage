import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
import {
  storageEqual,
  storageDeepEqual
} from '../../helpers/storage';

import Cache from 'dummy/models/cache';

var cache;

module('sessionStorage - cache', {
  beforeEach: function() {
    Ember.run(function() {
      cache = Cache.create();
    });
  },
  afterEach: function() {
    window.sessionStorage.clear();
  }
});

test('it has correct defaults', function() {
  expect(3);

  equal(cache.get('_storage'), 'session');
  equal(cache.get('storageKey'), 'cache');
  deepEqual(cache.get('initialContent'), {});
});


test('it saves changes to sessionStorage', function() {
  expect(3);

  ok(window.sessionStorage);
  storageDeepEqual(window.sessionStorage.cache, {});

  Ember.run(function() {
    cache.set('image1', 'image1png');
  });

  storageDeepEqual(window.sessionStorage.cache, {
    image1: 'image1png'
  });
});