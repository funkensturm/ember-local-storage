import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

const { get } = Ember;

moduleFor('router:main', 'legacy - config', {
  beforeEach() {
    let mockStorage = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          perPage: 10
        };
      }
    });

    this.register('storage:settings', mockStorage);
    this.register('storage:options', mockStorage);
  },
  afterEach() {
    window.localStorage.clear();
    _resetStorages();
  }
});

test('it has the correct key', function(assert) {
  assert.expect(4);
  const done = assert.async();
  let post = Ember.Object.extend({
    modelName: 'post',
    id: '123'
  }).create();

  this.register('object:test', Ember.Object.extend({
    post: post,
    settings: storageFor('settings', 'post'),
    options: storageFor('options', 'post')
  }));
  let subject = this.container.lookup('object:test');
  get(subject, 'settings').then((settings) => {
    assert.equal(get(settings, '_storageKey'), 'storage:settings:post:123');
    return get(subject, 'options');
  }).then((options) => {
    assert.equal(get(options, '_storageKey'), 'storage:options:post:123');
    storageDeepEqual(assert, window.localStorage['localforage/storage:settings:post:123'], {
      perPage: 10
    });
    storageDeepEqual(assert, window.localStorage['localforage/storage:options:post:123'], {
      perPage: 10
    });
    done();
  });
});
