import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { storageDeepEqual } from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import SessionStorageObject from 'ember-local-storage/session/object';
import { storageFor, _resetStorages } from 'ember-local-storage/helpers/storage';

let subject;

module('object - settings', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    let mockStorage = StorageObject.extend();
    let mockStorageB = StorageObject.extend();
    let mockStorageC = SessionStorageObject.extend();
    let mockStorageD = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          welcomeMessageSeen: false,
        };
      },
    });

    mockStorageB.reopenClass({
      initialState() {
        return {
          address: {
            first: null,
            second: null,
            anotherProp: null,
          },
        };
      },
    });

    this.owner.register('storage:settings', mockStorage);
    this.owner.register('storage:nested-objects', mockStorageB);
    this.owner.register('storage:cache', mockStorageC);
    this.owner.register('storage:local-cache', mockStorageD);

    this.owner.register(
      'object:test',
      EmberObject.extend({
        settings: storageFor('settings'),
        nestedObjects: storageFor('nested-objects'),
        cache: storageFor('cache'),
        localCache: storageFor('local-cache'),
      })
    );
    subject = this.owner.lookup('object:test');
  });

  hooks.afterEach(function () {
    window.localStorage.clear();
    window.sessionStorage.clear();
    _resetStorages();
  });

  test('it has correct defaults', function (assert) {
    assert.expect(6);

    assert.equal(subject.settings._storageType, 'local');
    assert.equal(subject.settings._storageKey, 'storage:settings');
    assert.deepEqual(subject.settings._initialContent, {
      welcomeMessageSeen: false,
    });

    assert.equal(subject.cache._storageType, 'session');
    assert.equal(subject.cache._storageKey, 'storage:cache');
    assert.deepEqual(subject.cache._initialContent, {});
  });

  test('it saves changes to sessionStorage', function (assert) {
    assert.expect(3);

    assert.ok(window.sessionStorage);
    storageDeepEqual(assert, window.sessionStorage['storage:cache'], undefined);

    run(function () {
      subject.set('cache.image1', 'image1png');
    });

    storageDeepEqual(assert, window.sessionStorage['storage:cache'], {
      image1: 'image1png',
    });
  });

  test('it saves changes to localStorage', function (assert) {
    assert.expect(3);

    assert.ok(window.localStorage);
    storageDeepEqual(assert, window.localStorage['storage:settings'], undefined);

    run(function () {
      subject.set('settings.welcomeMessageSeen', true);
    });

    storageDeepEqual(assert, window.localStorage['storage:settings'], {
      welcomeMessageSeen: true,
    });
  });

  test('it does not share data', function (assert) {
    assert.expect(10);

    assert.equal(subject.cache._storageType, 'session');
    assert.equal(subject.cache._storageKey, 'storage:cache');
    assert.deepEqual(subject.cache._initialContent, {});

    run(function () {
      subject.set('cache.key1', '123456');
    });

    assert.deepEqual(subject.cache.key1, '123456');

    assert.equal(subject.localCache._storageType, 'local');
    assert.equal(subject.localCache._storageKey, 'storage:local-cache');
    assert.deepEqual(subject.localCache._initialContent, {});

    assert.deepEqual(subject.cache.key1, '123456');

    run(function () {
      subject.set('localCache.key1', 'abcde');
    });

    assert.deepEqual(subject.localCache.key1, 'abcde');

    assert.deepEqual(subject.cache.key1, '123456');
  });

  test('it updates when change events fire', function (assert) {
    assert.expect(3);

    // setup testing
    subject.settings._testing = true;

    assert.equal(subject.settings.changeFired, undefined);
    window.dispatchEvent(
      new window.StorageEvent('storage', {
        key: 'storage:settings',
        newValue: '{"welcomeMessageSeen":false,"changeFired":true}',
        oldValue: '{"welcomeMessageSeen":false}',
        storageArea: subject.settings._storage(),
      })
    );
    assert.false(subject.settings.welcomeMessageSeen);
    assert.true(subject.settings.changeFired);
  });

  test('nested values get persisted', function (assert) {
    assert.expect(4);

    storageDeepEqual(assert, window.localStorage['storage:nested-objects'], undefined);

    assert.equal(subject.nestedObjects.address.first, null);

    run(function () {
      subject.nestedObjects.set('address.first', {
        street: 'Somestreet 1',
        city: 'A City',
      });
    });

    assert.deepEqual(subject.nestedObjects.address.first, {
      street: 'Somestreet 1',
      city: 'A City',
    });

    storageDeepEqual(assert, window.localStorage['storage:nested-objects'], {
      address: {
        first: {
          street: 'Somestreet 1',
          city: 'A City',
        },
        second: null,
        anotherProp: null,
      },
    });
  });

  test('reset method restores initialContent', function (assert) {
    assert.expect(5);

    //initialContent is set properly
    assert.deepEqual(subject.settings.content, {
      welcomeMessageSeen: false,
    });

    //set new properties and overwrite others
    run(function () {
      subject.set('settings.newProp', 'some-value');
      subject.set('settings.welcomeMessageSeen', true);
    });

    //we expect them to be present
    assert.equal(subject.settings.newProp, 'some-value');
    assert.true(subject.settings.welcomeMessageSeen);

    //reset
    subject.settings.reset();

    //data is back to initial values
    assert.deepEqual(subject.settings.content, {
      welcomeMessageSeen: false,
    });
    assert.strictEqual(subject.settings.newProp, undefined);
  });

  test('it updates _isInitialContent', function (assert) {
    assert.expect(2);

    assert.true(subject.settings.isInitialContent());

    run(function () {
      subject.set('settings.welcomeMessageSeen', true);
    });

    assert.false(subject.settings.isInitialContent());
  });

  test('it updates _isInitialContent on reset', function (assert) {
    assert.expect(2);

    run(function () {
      subject.set('settings.welcomeMessageSeen', true);
    });

    assert.false(subject.settings.isInitialContent());

    run(function () {
      subject.settings.reset();
    });

    assert.true(subject.settings.isInitialContent());
  });

  test('clear method removes the content from localStorage', function (assert) {
    assert.expect(2);

    run(function () {
      subject.settings.welcomeMessageSeen = true;
    });

    storageDeepEqual(assert, window.localStorage['storage:settings'], {
      welcomeMessageSeen: true,
    });

    run(function () {
      subject.settings.clear();
    });

    assert.equal(window.localStorage['storage:settings'], undefined);
  });

  test('after .clear() the object works as expected', function (assert) {
    assert.expect(4);

    run(function () {
      subject.set('settings.welcomeMessageSeen', true);
    });

    storageDeepEqual(assert, window.localStorage['storage:settings'], {
      welcomeMessageSeen: true,
    });

    run(function () {
      subject.settings.clear();
    });

    assert.equal(window.localStorage['storage:settings'], undefined);

    run(function () {
      subject.settings.welcomeMessageSeen = true;
    });

    storageDeepEqual(assert, window.localStorage['storage:settings'], {
      welcomeMessageSeen: true,
    });
    assert.true(subject.settings.welcomeMessageSeen);
  });
});
