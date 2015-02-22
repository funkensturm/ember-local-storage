import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
import {
  storageEqual,
  storageDeepEqual
} from '../../helpers/storage';

import AnonymousLikes from 'dummy/models/anonymous-likes';

var anonymousLikes;

module('localeStorage - anonymousLikes', {
  beforeEach: function() {
    Ember.run(function() {
      anonymousLikes = AnonymousLikes.create();
    });
  },
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it has correct defaults', function() {
  expect(3);

  equal(anonymousLikes.get('_storage'), 'local');
  equal(anonymousLikes.get('storageKey'), 'anonymous-likes');
  deepEqual(anonymousLikes.get('initialContent'), []);
});


test('it saves changes to localStorage', function() {
  expect(4);

  ok(window.localStorage);
  storageEqual(window.localStorage['anonymous-likes'], undefined);

  Ember.run(function() {
    anonymousLikes.addObject('id1');
  });

  storageDeepEqual(window.localStorage['anonymous-likes'], ['id1']);

  Ember.run(function() {
    anonymousLikes.removeObject('id1');
  });

  storageDeepEqual(window.localStorage['anonymous-likes'], []);
});