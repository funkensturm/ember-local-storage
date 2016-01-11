import Ember from 'ember';
import { module, test } from 'qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageArray from 'ember-local-storage/local/array';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let registry;
let container;
let subject;

const registryOpts = { singleton: true, instantiate: false };

module('array - likes', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

    let mockStorage = StorageArray.extend();
    let mockStorageB = StorageArray.extend();

    registry.register('storage:anonymous-likes', mockStorage, registryOpts);
    registry.register('storage:post-likes', mockStorageB, registryOpts);

    subject = Ember.Object.extend({
      container,
      anonymousLikes: storageFor('anonymous-likes'),
      postLikes: storageFor('post-likes')
    }).create();
  },
  afterEach() {
    window.localStorage.clear();
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(subject.get('anonymousLikes._storage'), 'local');
  assert.equal(
    subject.get('anonymousLikes.storageKey'),
    'storage:anonymous-likes'
  );
  assert.deepEqual(subject.get('anonymousLikes._initialContent'), []);
});

test('it does not share data', function(assert) {
  assert.expect(5);

  // ImageLikes
  assert.deepEqual(subject.get('anonymousLikes._initialContent'), []);
  Ember.run(function() {
    subject.get('anonymousLikes').addObject('martin');
  });
  assert.deepEqual(subject.get('anonymousLikes.content'), ['martin']);

  // PostLikes
  assert.deepEqual(subject.get('postLikes._initialContent'), []);
  Ember.run(function() {
    subject.get('postLikes').addObject('peter');
  });
  assert.deepEqual(subject.get('postLikes.content'), ['peter']);

  // ImageLikes don't change
  assert.deepEqual(subject.get('anonymousLikes.content'), ['martin']);
});

test('reset method restores initialContent', function(assert) {
  assert.expect(4);

  //initialContent is set properly
  assert.deepEqual(subject.get('postLikes.content'), []);

  //add new objects
  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });

  //we expect them to be present
  assert.deepEqual(subject.get('postLikes.content'), ['martin']);

  //reset
  subject.get('postLikes').reset();

  //data is back to initial values
  assert.deepEqual(subject.get('postLikes.content'), []);

  // localStorage is in sync
  storageDeepEqual(assert, window.localStorage['storage:post-likes'], []);
});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);

  assert.equal(subject.get('postLikes').isInitialContent(), true);
  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });
  assert.equal(subject.get('postLikes').isInitialContent(), false);
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);

  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });
  assert.equal(subject.get('postLikes').isInitialContent(), false);

  Ember.run(function() {
    subject.get('postLikes').reset();
  });
  assert.equal(subject.get('postLikes').isInitialContent(), true);
});

test('clear method removes the content from localStorage', function(assert) {
  assert.expect(2);

  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );

  Ember.run(function() {
    subject.get('postLikes').clear();
  });
  assert.equal(window.localStorage['storage:post-likes'], undefined);
});

test('after .clear() the array works as expected', function(assert) {
  assert.expect(4);

  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );

  Ember.run(function() {
    subject.get('postLikes').clear();
  });
  assert.equal(window.localStorage['storage:post-likes'], undefined);

  Ember.run(function() {
    subject.get('postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );
  assert.deepEqual(subject.get('postLikes.content'), ['martin']);
});