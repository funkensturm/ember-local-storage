import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

module('legacy - config', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
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
  });

  hooks.afterEach(function() {
    window.localStorage.clear();
    _resetStorages();
  });

  test('it has the correct key', function(assert) {
    assert.expect(4);

    let post = Ember.Object.extend({
      modelName: 'post',
      id: '123'
    }).create();

    this.owner.register('object:test', Ember.Object.extend({
      post: post,
      settings: storageFor('settings', 'post'),
      options: storageFor('options', 'post')
    }));
    let subject = this.owner.lookup('object:test');

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
});
