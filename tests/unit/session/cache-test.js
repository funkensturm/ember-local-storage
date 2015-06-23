import Ember from 'ember';
import { module, test } from 'qunit';
import {
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

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(cache.get('_storage'), 'session');
  assert.equal(cache.get('storageKey'), 'cache');
  assert.deepEqual(cache.get('initialContent'), {});
});


test('it saves changes to sessionStorage', function(assert) {
  assert.expect(3);

  assert.ok(window.sessionStorage);
  storageDeepEqual(assert, window.sessionStorage.cache, {});

  Ember.run(function() {
    cache.set('image1', 'image1png');
  });

  storageDeepEqual(assert, window.sessionStorage.cache, {
    image1: 'image1png'
  });
});
