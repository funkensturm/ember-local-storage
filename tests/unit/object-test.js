import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import SessionStorageObject from 'ember-local-storage/session/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let subject;

const {
  run,
  get
} = Ember;

moduleFor('router:main', 'object - settings', {
  beforeEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    let mockStorage = StorageObject.extend();
    let mockStorageB = StorageObject.extend();
    let mockStorageC = SessionStorageObject.extend();
    let mockStorageD = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          welcomeMessageSeen: false
        };
      }
    });

    mockStorageB.reopenClass({
      initialState() {
        return {
          address: {
            first: null,
            second: null,
            anotherProp: null
          }
        };
      }
    });

    this.register('storage:settings', mockStorage);
    this.register('storage:nested-objects', mockStorageB);
    this.register('storage:cache', mockStorageC);
    this.register('storage:local-cache', mockStorageD);

    this.register('object:test', Ember.Object.extend({
      settings: storageFor('settings'),
      nestedObjects: storageFor('nested-objects'),
      cache: storageFor('cache'),
      localCache: storageFor('local-cache')
    }));
    subject = this.container.lookup('object:test');
  },
  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(6);
  const done = assert.async();
  const promise1 = get(subject, 'settings')
  const promise2 = get(subject, 'cache');
  promise1.then((settings) => {
    assert.equal(get(settings, '_storageType'), 'local');
    assert.equal(get(settings, '_storageKey'), 'storage:settings');
    assert.deepEqual(get(settings, '_initialContent'), { welcomeMessageSeen: false });
    return promise2;
  }).then((cache) => {
    assert.equal(get(cache, '_storageType'), 'session');
    assert.equal(get(cache, '_storageKey'), 'storage:cache');
    assert.deepEqual(get(cache, '_initialContent'), {});
    done();
  });
});

test('it saves changes to sessionStorage', function(assert) {
  assert.expect(3);
  assert.ok(!!window.sessionStorage);
  const done = assert.async();
  const promise = get(subject, 'cache');
  storageDeepEqual(assert, window.sessionStorage['localforage/storage:cache'], undefined);
  promise.then((cache) => {
    return run(cache, 'set', 'image1', 'image1png');
  }).then(() => {
    storageDeepEqual(assert, window.sessionStorage['localforage/storage:cache'], {
      image1: 'image1png'
    });
    done();
  });
});

test('it saves changes to localStorage', function(assert) {
  assert.expect(3);
  const done = assert.async();
  assert.ok(window.localStorage);
  storageDeepEqual(assert, window.localStorage['localforage/storage:settings'], undefined);

  get(subject, 'settings').then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then(() => {
    storageDeepEqual(assert, window.localStorage['localforage/storage:settings'], {
      welcomeMessageSeen: true
    });
    done();
  })
});

test('it does not share data', function(assert) {
  assert.expect(10);
  const done = assert.async();
  const promise = get(subject, 'cache');
  promise.then((cache) => {
    assert.equal(get(cache, '_storageType'), 'session');
    assert.equal(get(cache, '_storageKey'), 'storage:cache');
    assert.deepEqual(get(cache, '_initialContent'), {});
    return run(cache, 'set', 'key1', '123456');
  }).then((cache) => {
    assert.deepEqual(get(cache, 'key1'), '123456');
    return get(subject, 'localCache');
  }).then((localCache) => {
    assert.equal(get(localCache, '_storageType'), 'local');
    assert.equal(get(localCache, '_storageKey'), 'storage:local-cache');
    assert.deepEqual(get(localCache, '_initialContent'), {});
    return promise;
  }).then((cache) => {
    assert.deepEqual(get(cache, 'key1'), '123456');
    return get(subject, 'localCache');
  }).then((localCache) => {
    return run(localCache, 'set', 'key1', 'abcde');
  }).then((localCache) => {
    assert.deepEqual(get(localCache, 'key1'), 'abcde');
    return promise;
  }).then((cache) => {
    assert.deepEqual(get(cache, 'key1'), '123456');
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});

/*test('it updates when change events fire', function(assert) {
  assert.expect(3);

  // setup testing
  get(subject, 'settings')._testing = true;

  assert.equal(get(subject, 'settings.changeFired'), undefined);
  window.dispatchEvent(new window.StorageEvent('storage', {
    key: 'storage:settings',
    newValue: '{"welcomeMessageSeen":false,"changeFired":true}',
    oldValue: '{"welcomeMessageSeen":false}',
    storageArea: get(subject, 'settings')._storage()
  }));
  assert.equal(get(subject, 'settings.welcomeMessageSeen'), false);
  assert.equal(get(subject, 'settings.changeFired'), true);
});*/

test('nested values get persisted', function(assert) {
  assert.expect(4);
  storageDeepEqual(assert, window.localStorage['localforage/storage:nested-objects'], undefined);
  assert.equal(get(subject, 'nestedObjects.address.first'), null);
  const done = assert.async();
  const promise = get(subject, 'nestedObjects');
  promise.then((nestedObjects) => {
    return run(nestedObjects, 'set', 'address.first', {
      street: 'Somestreet 1',
      city: 'A City'
    });
  }).then((nestedObjects) => {
    assert.deepEqual(get(nestedObjects, 'address.first'), {
      street: 'Somestreet 1',
      city: 'A City'
    });
    storageDeepEqual(assert, window.localStorage['localforage/storage:nested-objects'], {
      address: {
        first: {
          street: 'Somestreet 1',
          city: 'A City'
        },
        second: null,
        anotherProp: null
      }
    });
    done();
  });
});

test('reset method restores initialContent', function(assert) {
  assert.expect(5);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    assert.deepEqual(get(settings, 'content'), {
      welcomeMessageSeen: false
    });
    return run(settings, 'set', 'newProp', 'some-value');
  }).then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    assert.equal(get(settings, 'newProp'), 'some-value');
    assert.equal(get(settings, 'welcomeMessageSeen'), true);
    return settings.reset();
  }).then((settings) => {
    assert.deepEqual(get(settings, 'content'), { welcomeMessageSeen: false });
    assert.strictEqual(get(settings, 'newProp'), undefined);
    done();
  });
});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    assert.equal(settings.isInitialContent(), true);
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    assert.equal(settings.isInitialContent(), false);
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    assert.equal(settings.isInitialContent(), false);
    return run(settings, 'reset');
  }).then((settings) => {
    assert.equal(settings.isInitialContent(), true);
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});

test('clear method removes the content from localStorage', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    storageDeepEqual(assert, window.localStorage['localforage/storage:settings'], {
      welcomeMessageSeen: true
    });
    return run(settings, 'clear');
  }).then(() => {
    assert.equal(window.localStorage['localforage/storage:settings'], undefined);
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});

test('set() modifies property in storage', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then(() => {
    storageDeepEqual(assert, window.localStorage['localforage/storage:settings'], {
      welcomeMessageSeen: true
    });
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});

test('clear() empties contents in storage', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    return run(settings, 'clear');
  }).then(() => {
    assert.equal(window.localStorage['localforage/storage:settings'], undefined);
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
})

test('after .clear() the object works as expected', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const promise = get(subject, 'settings');
  promise.then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    return run(settings, 'clear');
  }).then((settings) => {
    return run(settings, 'set', 'welcomeMessageSeen', true);
  }).then((settings) => {
    assert.equal(get(settings, 'welcomeMessageSeen'), true);
    storageDeepEqual(assert, window.localStorage['localforage/storage:settings'], {
      welcomeMessageSeen: true
    });
    done();
  });
});
