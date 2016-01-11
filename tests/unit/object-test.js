import Ember from 'ember';
import { module, test } from 'qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import SessionStorageObject from 'ember-local-storage/session/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let registry;
let container;
let subject;

const registryOpts = { singleton: true, instantiate: false };

module('object - settings', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

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

    registry.register('storage:settings', mockStorage, registryOpts);
    registry.register('storage:nested-objects', mockStorageB, registryOpts);
    registry.register('storage:cache', mockStorageC, registryOpts);
    registry.register('storage:local-cache', mockStorageD, registryOpts);

    subject = Ember.Object.extend({
      container,
      settings: storageFor('settings'),
      nestedObjects: storageFor('nested-objects'),
      cache: storageFor('cache'),
      localCache: storageFor('local-cache')
    }).create();
  },
  afterEach() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(6);

  assert.equal(subject.get('settings._storage'), 'local');
  assert.equal(subject.get('settings.storageKey'), 'storage:settings');
  assert.deepEqual(subject.get('settings._initialContent'), {
    welcomeMessageSeen: false
  });

  assert.equal(subject.get('cache._storage'), 'session');
  assert.equal(subject.get('cache.storageKey'), 'storage:cache');
  assert.deepEqual(subject.get('cache._initialContent'), {});
});

test('it saves changes to sessionStorage', function(assert) {
  assert.expect(3);

  assert.ok(window.sessionStorage);
  storageDeepEqual(assert, window.sessionStorage['storage:cache'], undefined);

  Ember.run(function() {
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

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });
});

test('it does not share data', function(assert) {
  assert.expect(10);

  assert.equal(subject.get('cache._storage'), 'session');
  assert.equal(subject.get('cache.storageKey'), 'storage:cache');
  assert.deepEqual(subject.get('cache._initialContent'), {});

  Ember.run(function() {
    subject.set('cache.key1', '123456');
  });

  assert.deepEqual(subject.get('cache.key1'), '123456');

  assert.equal(subject.get('localCache._storage'), 'local');
  assert.equal(subject.get('localCache.storageKey'), 'storage:local-cache');
  assert.deepEqual(subject.get('localCache._initialContent'), {});

  assert.deepEqual(subject.get('cache.key1'), '123456');

  Ember.run(function() {
    subject.set('localCache.key1', 'abcde');
  });

  assert.deepEqual(subject.get('localCache.key1'), 'abcde');

  assert.deepEqual(subject.get('cache.key1'), '123456');
});

test('it updates when change events fire', function(assert) {
  assert.expect(3);

  assert.equal(subject.get('settings.changeFired'), undefined);
  window.dispatchEvent(new window.StorageEvent('storage', {
    key: 'storage:settings',
    newValue: '{"welcomeMessageSeen":false,"changeFired":true}',
    oldValue: '{"welcomeMessageSeen":false}',
    storageArea: subject.get('settings').storage()
  }));
  assert.equal(subject.get('settings.welcomeMessageSeen'), false);
  assert.equal(subject.get('settings.changeFired'), true);
});

test('nested values get persisted', function(assert) {
  assert.expect(4);

  storageDeepEqual(assert, window.localStorage['storage:nested-objects'], undefined);

  assert.equal(subject.get('nestedObjects.address.first'), null);

  Ember.run(function() {
    subject.get('nestedObjects').set('address.first', {
      street: 'Somestreet 1',
      city: 'A City'
    });
  });

  assert.deepEqual(subject.get('nestedObjects.address.first'), {
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

  //initialContent is set properly
  assert.deepEqual(subject.get('settings.content'), {
    welcomeMessageSeen: false
  });

  //set new properties and overwrite others
  Ember.run(function() {
    subject.set('settings.newProp', 'some-value');
    subject.set('settings.welcomeMessageSeen', true);
  });

  //we expect them to be present
  assert.equal(subject.get('settings.newProp'), 'some-value');
  assert.equal(subject.get('settings.welcomeMessageSeen'), true);

  //reset
  subject.get('settings').reset();

  //data is back to initial values
  assert.deepEqual(subject.get('settings.content'), {
    welcomeMessageSeen: false
  });
  assert.strictEqual(subject.get('settings.newProp'), undefined);
});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);

  assert.equal(subject.get('settings').isInitialContent(), true);

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  assert.equal(subject.get('settings').isInitialContent(), false);
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  assert.equal(subject.get('settings').isInitialContent(), false);

  Ember.run(function() {
    subject.get('settings').reset();
  });

  assert.equal(subject.get('settings').isInitialContent(), true);
});

test('clear method removes the content from localStorage', function(assert) {
  assert.expect(2);

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });

  Ember.run(function() {
    subject.get('settings').clear();
  });

  assert.equal(window.localStorage['storage:settings'], undefined);
});

test('after .clear() the object works as expected', function(assert) {
  assert.expect(4);

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });

  Ember.run(function() {
    subject.get('settings').clear();
  });

  assert.equal(window.localStorage['storage:settings'], undefined);

  Ember.run(function() {
    subject.set('settings.welcomeMessageSeen', true);
  });

  storageDeepEqual(assert, window.localStorage['storage:settings'], {
    welcomeMessageSeen: true
  });
  assert.equal(subject.get('settings.welcomeMessageSeen'), true);
});