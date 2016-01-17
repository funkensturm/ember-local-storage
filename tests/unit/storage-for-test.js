import Ember from 'ember';
import { module, test } from 'qunit';
import {
  storageDeepEqual
} from '../helpers/storage';

import StorageObject from 'ember-local-storage/local/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let registry;
let container;

const registryOpts = { singleton: true, instantiate: false };

module('legacy - config', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

    let mockStorage = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          perPage: 10
        };
      }
    });

    registry.register('storage:settings', mockStorage, registryOpts);
  },
  afterEach() {
    window.localStorage.clear();
    _resetStorages();
  }
});

test('it has the correct key', function(assert) {
  assert.expect(2);

  let post = Ember.Object.extend({
    modelName: 'post',
    id: '123'
  }).create();

  let subject = Ember.Object.extend({
    container,
    post: post,
    settings: storageFor('settings', 'post')
  }).create();

  assert.equal(
    subject.get('settings._storageKey'),
    'storage:settings:post:123'
  );

  storageDeepEqual(assert, window.localStorage['storage:settings:post:123'], {
    perPage: 10
  });
});