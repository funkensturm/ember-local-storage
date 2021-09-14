import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  storageDeepEqual,
  registerConfigEnvironment,
  setConfigEnvironment
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let subject;

module('storageFor', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    registerConfigEnvironment(this);

    let mockStorage = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          perPage: 10
        };
      }
    });

    this.owner.register('storage:settings', mockStorage);
    this.owner.register('storage:options', mockStorage);

    let post = EmberObject.extend({
      modelName: 'post',
      id: '123'
    }).create();

    this.owner.register('object:test', EmberObject.extend({
      post: post,
      settings: storageFor('settings', 'post'),
      options: storageFor('options', 'post')
    }));
    subject = this.owner.lookup('object:test');
  });

  hooks.afterEach(function() {
    window.localStorage.clear();
    _resetStorages();
  });

  test('it has the correct key (namespace not set)', function(assert) {
    assert.expect(4);

    assert.equal(
      subject.get('settings._storageKey'),
      'storage:settings:post:123'
    );

    assert.equal(
      subject.get('options._storageKey'),
      'storage:options:post:123'
    );

    storageDeepEqual(assert, window.localStorage['storage:settings:post:123'], {
      perPage: 10
    });

    storageDeepEqual(assert, window.localStorage['storage:options:post:123'], {
      perPage: 10
    });
  });

  test('it has the correct key (namespace: true)', function(assert) {
    assert.expect(4);

    setConfigEnvironment(this, 'namespace', true);

    assert.equal(
      subject.get('settings._storageKey'),
      'my-app:storage:settings:post:123'
    );

    assert.equal(
      subject.get('options._storageKey'),
      'my-app:storage:options:post:123'
    );

    storageDeepEqual(assert,
      window.localStorage['my-app:storage:settings:post:123'],
      {
        perPage: 10
      }
    );

    storageDeepEqual(assert,
      window.localStorage['my-app:storage:options:post:123'],
      {
        perPage: 10
      }
    );
  });

  test('it has the correct key (namespace: "custom")', function(assert) {
    assert.expect(4);

    setConfigEnvironment(this, 'namespace', 'custom');

    assert.equal(
      subject.get('settings._storageKey'),
      'custom:storage:settings:post:123'
    );

    assert.equal(
      subject.get('options._storageKey'),
      'custom:storage:options:post:123'
    );

    storageDeepEqual(assert,
      window.localStorage['custom:storage:settings:post:123'],
      {
        perPage: 10
      }
    );

    storageDeepEqual(assert,
      window.localStorage['custom:storage:options:post:123'],
      {
        perPage: 10
      }
    );
  });

  test('it has the correct key (keyDelimiter: "/")', function(assert) {
    assert.expect(4);

    setConfigEnvironment(this, 'namespace', true);
    setConfigEnvironment(this, 'keyDelimiter', '/');

    assert.equal(
      subject.get('settings._storageKey'),
      'my-app/storage:settings:post:123'
    );

    assert.equal(
      subject.get('options._storageKey'),
      'my-app/storage:options:post:123'
    );

    storageDeepEqual(assert,
      window.localStorage['my-app/storage:settings:post:123'],
      {
        perPage: 10
      }
    );

    storageDeepEqual(assert,
      window.localStorage['my-app/storage:options:post:123'],
      {
        perPage: 10
      }
    );
  });
});

