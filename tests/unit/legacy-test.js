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
let subject;

const registryOpts = { singleton: true, instantiate: false };

module('legacy - config', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

    // old serialized content
    window.localStorage.settings = JSON.stringify({
      mapStyle: 'dark'
    });

    let mockStorage = StorageObject.extend();

    mockStorage.reopenClass({
      initialState() {
        return {
          token: 1234
        };
      }
    });

    registry.register('storage:config', mockStorage, registryOpts);

    subject = Ember.Object.extend({
      container,
      settings: storageFor('config', null, { legacyKey: 'settings' })
    }).create();
  },
  afterEach() {
    window.localStorage.clear();
    _resetStorages();
  }
});

test('it has correct defaults', function(assert) {
  assert.expect(3);

  assert.equal(subject.get('settings._storage'), 'local');
  assert.equal(subject.get('settings.storageKey'), 'settings');
  assert.deepEqual(subject.get('settings._initialContent'), {
    token: 1234
  });
});

test('serialized content can be used', function(assert) {
  assert.expect(2);

  assert.equal(subject.get('settings.mapStyle'), 'dark');
  storageDeepEqual(assert, window.localStorage.settings, {
    mapStyle: 'dark',
    token: 1234
  });
});