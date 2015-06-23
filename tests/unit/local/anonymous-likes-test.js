import Ember from 'ember';
import { module, test } from 'qunit';
import {
  storageEqual,
  storageDeepEqual
} from '../../helpers/storage';

import AnonymousLikes from 'dummy/models/anonymous-likes';

var anonymousLikes = 1;

module('localStorage - anonymousLikes', {
  beforeEach: function() {
    Ember.run(function() {
      anonymousLikes = AnonymousLikes.create();
    });
  },
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(anonymousLikes.get('_storage'), 'local');
  assert.equal(anonymousLikes.get('storageKey'), 'anonymous-likes');
  assert.deepEqual(anonymousLikes.get('initialContent'), []);
});


test('it saves changes to localStorage', function(assert) {
  assert.expect(4);

  assert.ok(window.localStorage);
  storageEqual(assert, window.localStorage['anonymous-likes'], undefined);

  Ember.run(function() {
    anonymousLikes.addObject('id1');
  });

  storageDeepEqual(assert, window.localStorage['anonymous-likes'], ['id1']);

  Ember.run(function() {
    anonymousLikes.removeObject('id1');
  });

  storageDeepEqual(assert, window.localStorage['anonymous-likes'], []);
});
