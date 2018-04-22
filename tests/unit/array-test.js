import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import { moduleFor, test } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageArray from 'ember-local-storage/local/array';
import {
  storageFor,
  _resetStorages
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
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);
  get(subject, 'anonymousLikes').then((storage) => {
    assert.equal(get(storage, '_storageType'), 'local');
    assert.equal(get(storage, '_storageKey'), 'storage:anonymous-likes');
    assert.deepEqual(get(storage, '_initialContent'), []);
  });
});

test('it does not share data', function(assert) {
  const done = assert.async();
  assert.expect(5);
  const storage1 = get(subject, 'anonymousLikes');
  const storage2 = get(subject, 'postLikes');
  storage1.then((storage) => {
    assert.deepEqual(get(storage, '_initialContent'), []);
    return storage.addObject('martin');
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), ['martin']);
    return storage2;
  }).then((storage) => {
    assert.deepEqual(get(storage, '_initialContent'), []);
    return storage.addObject('peter');
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), ['peter']);
    return storage1;
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), ['martin']);
    done();
  });
});

test('reset method restores initialContent', function(assert) {
  const done = assert.async();
  assert.expect(4);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    assert.deepEqual(get(storage, 'content'), []);
    return storage.addObject('martin');
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), ['martin']);
    return storage.reset();
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), []);
    storageDeepEqual(assert, window.localStorage['localforage/storage:post-likes'], []);
    done();
  });
});

test('it updates _isInitialContent', function(assert) {
  const done = assert.async();
  assert.expect(2);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    assert.equal(storage.isInitialContent(), true);
    return storage.addObject('martin');
  }).then((storage) => {
    assert.equal(storage.isInitialContent(), false);
    done();
  });
});

test('it updates _isInitialContent on reset', function(assert) {
  const done = assert.async();
  assert.expect(3);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    assert.equal(storage.isInitialContent(), true);
    return storage.addObject('martin');
  }).then((storage) => {
    assert.equal(storage.isInitialContent(), false);
    return storage.reset();
  }).then((storage) => {
    assert.equal(storage.isInitialContent(), true);
    done();
  });
});

test('clear method removes the content from localStorage', function(assert) {
  const done = assert.async();
  assert.expect(3);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    return run(storage, 'addObject', 'martin');
  }).then((storage) => {
    assert.deepEqual(get(storage, 'content'), ['martin']);
    return wait().then(() => {
      storageDeepEqual(assert, window.localStorage['localforage/storage:post-likes'], ['martin']);
    }).then(() => {
      return storage.clear();
    });
  }).then(() => {
    assert.equal(window.localStorage['localforage/storage:post-likes'], undefined);
    done();
  });
});

test('set() modifies property in storage', function(assert) {
  const done = assert.async();
  assert.expect(1);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    run(storage, 'addObject', 'martin');
    wait().then(() => {
      storageDeepEqual(assert, window.localStorage['localforage/storage:post-likes'], ['martin']);
      done();
    });
  });
});

test('clear() empties contents in storage', function(assert) {
  const done = assert.async();
  assert.expect(1);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    return run(storage, 'addObject', 'martin');
  }).then((storage) => {
    return run(storage, 'clear');
  }).then(() => {
    assert.equal(window.localStorage['storage:post-likes'], undefined);
    done();
  });
});

test('after .clear() the array works as expected', function(assert) {
  const done = assert.async();
  assert.expect(2);
  const promise = get(subject, 'postLikes');
  promise.then((storage) => {
    return run(storage, 'addObject', 'martin');
  }).then((storage) => {
    return run(storage, 'clear');
  }).then((storage) => {
    return run(storage, 'addObject', 'bobby');
  }).then((storage) => {
    wait().then(() => {
      storageDeepEqual(assert, window.localStorage['localforage/storage:post-likes'], ['bobby']);
      assert.deepEqual(get(storage, 'content'), ['bobby']);
      done();
    });
  });
});
