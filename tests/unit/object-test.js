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
    // }).create();
    // run(subject, 'getProperties', 'settings', 'nestedObjects', 'cache', 'localCache');
  },
  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(6);
  run(function() {
    assert.equal(get(subject, 'settings._storageType'), 'local');
    assert.equal(get(subject, 'settings._storageKey'), 'storage:settings');
    assert.deepEqual(get(subject, 'settings._initialContent'), {
      welcomeMessageSeen: false
    });
    assert.equal(get(subject, 'cache._storageType'), 'session');
    assert.equal(get(subject, 'cache._storageKey'), 'storage:cache');
    assert.deepEqual(get(subject, 'cache._initialContent'), {});
  });
});

test('it saves changes to sessionStorage', function(assert) {
  assert.expect(3);

  assert.ok(window.sessionStorage);
  storageDeepEqual(assert, window.sessionStorage['storage:cache'], undefined);

  run(function() {
    subject.set('cache.image1', 'image1png');
  });

  storageDeepEqual(assert, window.sessionStorage['storage:cache'], {
    image1: 'image1png'
  });
});

test('it saves changes to localStorage', function(assert) {
  assert.expect(3);

  assert.ok(window.localStorage);
  storageDeepEqual(assert, window.localStorage['storage:settings'], undefined);

  run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });
});

test('it does not share data', function(assert) {
  assert.expect(10);
  run(function() {
    assert.equal(get(subject, 'cache._storageType'), 'session');
    assert.equal(get(subject, 'cache._storageKey'), 'storage:cache');
    assert.deepEqual(get(subject, 'cache._initialContent'), {});
    subject.set('cache.key1', '123456');
    assert.deepEqual(get(subject, 'cache.key1'), '123456');

    assert.equal(get(subject, 'localCache._storageType'), 'local');
    assert.equal(get(subject, 'localCache._storageKey'), 'storage:local-cache');
    assert.deepEqual(get(subject, 'localCache._initialContent'), {});

    assert.deepEqual(get(subject, 'cache.key1'), '123456');

    subject.set('localCache.key1', 'abcde');

    assert.deepEqual(get(subject, 'localCache.key1'), 'abcde');

    assert.deepEqual(get(subject, 'cache.key1'), '123456');
  });
});

test('it updates when change events fire', function(assert) {
  assert.expect(3);

  // setup testing
  run(function() {
    get(subject, 'settings')._testing = true;
  });

  assert.equal(get(subject, 'settings.changeFired'), undefined);
  run(window, 'dispatchEvent', new window.StorageEvent('storage', {
    key: 'storage:settings',
    newValue: '{"welcomeMessageSeen":false,"changeFired":true}',
    oldValue: '{"welcomeMessageSeen":false}',
    storageArea: get(subject, 'settings')._storage()
  }));
  assert.equal(get(subject, 'settings.welcomeMessageSeen'), false);
  assert.equal(get(subject, 'settings.changeFired'), true);
});

test('nested values get persisted', function(assert) {
  assert.expect(4);

  run(function() {
    storageDeepEqual(assert, window.localStorage['storage:nested-objects'], undefined);

    assert.equal(get(subject, 'nestedObjects.address.first'), null);

    get(subject, 'nestedObjects').set('address.first', {
      street: 'Somestreet 1',
      city: 'A City'
    });
  });

  assert.deepEqual(get(subject, 'nestedObjects.address.first'), {
    street: 'Somestreet 1',
    city: 'A City'
  });

  storageDeepEqual(assert, window.localStorage['storage:nested-objects'], {
    address: {
      first: {
        street: 'Somestreet 1',
        city: 'A City'
      },
      second: null,
      anotherProp: null
    }
  });
});

test('reset method restores initialContent', function(assert) {
  assert.expect(5);

  run(function() {
    //initialContent is set properly
    assert.deepEqual(get(subject, 'settings.content'), {
      welcomeMessageSeen: false
    });

    //set new properties and overwrite others
    subject.set('settings.newProp', 'some-value');
    subject.set('settings.welcomeMessageSeen', true);
  });

  //we expect them to be present
  assert.equal(get(subject, 'settings.newProp'), 'some-value');
  assert.equal(get(subject, 'settings.welcomeMessageSeen'), true);

  //reset
  run(get(subject, 'settings'), 'reset');

  //data is back to initial values
  assert.deepEqual(get(subject, 'settings.content'), {
    welcomeMessageSeen: false
  });
  assert.strictEqual(get(subject, 'settings.newProp'), undefined);
});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);

  run(function() {
    assert.equal(get(subject, 'settings').isInitialContent(), true);

    subject.set('settings.welcomeMessageSeen', true);
  });

  assert.equal(get(subject, 'settings').isInitialContent(), false);
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);

  run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  assert.equal(get(subject, 'settings').isInitialContent(), false);

  run(function() {
    get(subject, 'settings').reset();
  });

  assert.equal(get(subject, 'settings').isInitialContent(), true);
});

test('clear method removes the content from localStorage', function(assert) {
  assert.expect(2);

  run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });

  run(function() {
    get(subject, 'settings').clear();
  });

  assert.equal(window.localStorage['storage:settings'], undefined);
});

test('after .clear() the object works as expected', function(assert) {
  assert.expect(4);

  run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });

  run(function() {
    get(subject, 'settings').clear();
  });

  assert.equal(window.localStorage['storage:settings'], undefined);

  run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });
  assert.equal(get(subject, 'settings.welcomeMessageSeen'), true);
});
