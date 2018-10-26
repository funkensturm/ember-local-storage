import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageArray from 'ember-local-storage/local/array';
import {
  storageFor,
  resetStorages
} from 'ember-local-storage/helpers/storage';

let subject;

const {
  run,
  get
} = Ember;

moduleFor('router:main', 'array - likes', {
  beforeEach() {
    let mockStorage = StorageArray.extend();
    let mockStorageB = StorageArray.extend();

    this.register('storage:anonymous-likes', mockStorage);
    this.register('storage:post-likes', mockStorageB);
    this.register('object:test', Ember.Object.extend({
      anonymousLikes: storageFor('anonymous-likes'),
      postLikes: storageFor('post-likes')
    }));
    subject = this.container.lookup('object:test');
  },
  afterEach() {
    window.localStorage.clear();
    resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(get(subject, 'anonymousLikes._storageType'), 'local');
  assert.equal(
    get(subject, 'anonymousLikes._storageKey'),
    'storage:anonymous-likes'
  );
  assert.deepEqual(get(subject, 'anonymousLikes._initialContent'), []);
});

test('it does not share data', function(assert) {
  assert.expect(5);

  // ImageLikes
  assert.deepEqual(get(subject, 'anonymousLikes._initialContent'), []);
  run(function() {
    get(subject, 'anonymousLikes').addObject('martin');
  });
  assert.deepEqual(get(subject, 'anonymousLikes.content'), ['martin']);

  // PostLikes
  assert.deepEqual(get(subject, 'postLikes._initialContent'), []);
  run(function() {
    get(subject, 'postLikes').addObject('peter');
  });
  assert.deepEqual(get(subject, 'postLikes.content'), ['peter']);

  // ImageLikes don't change
  assert.deepEqual(get(subject, 'anonymousLikes.content'), ['martin']);
});

test('reset method restores initialContent', function(assert) {
  assert.expect(4);

  //initialContent is set properly
  assert.deepEqual(get(subject, 'postLikes.content'), []);

  //add new objects
  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });

  //we expect them to be present
  assert.deepEqual(get(subject, 'postLikes.content'), ['martin']);

  //reset
  get(subject, 'postLikes').reset();

  //data is back to initial values
  assert.deepEqual(get(subject, 'postLikes.content'), []);

  // localStorage is in sync
  storageDeepEqual(assert, window.localStorage['storage:post-likes'], []);
});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);

  assert.equal(get(subject, 'postLikes').isInitialContent(), true);
  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });
  assert.equal(get(subject, 'postLikes').isInitialContent(), false);
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);

  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });
  assert.equal(get(subject, 'postLikes').isInitialContent(), false);

  run(function() {
    get(subject, 'postLikes').reset();
  });
  assert.equal(get(subject, 'postLikes').isInitialContent(), true);
});

test('clear method removes the content from localStorage', function(assert) {
  assert.expect(2);

  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );

  run(function() {
    get(subject, 'postLikes').clear();
  });
  assert.equal(window.localStorage['storage:post-likes'], undefined);
});

test('after .clear() the array works as expected', function(assert) {
  assert.expect(4);

  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );

  run(function() {
    get(subject, 'postLikes').clear();
  });
  assert.equal(window.localStorage['storage:post-likes'], undefined);

  run(function() {
    get(subject, 'postLikes').addObject('martin');
  });
  storageDeepEqual(
    assert,
    window.localStorage['storage:post-likes'],
    ['martin']
  );
  assert.deepEqual(get(subject, 'postLikes.content'), ['martin']);
});
