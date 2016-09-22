import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import {
  storageDeepEqual
} from '../helpers/storage';
import run from 'ember-runloop';

import StorageObject from 'ember-local-storage/local/object';
import {
  storageFor,
  _resetStorages
} from 'ember-local-storage/helpers/storage';

let subject;

moduleFor('router:main', 'legacy - config', {
  beforeEach() {
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

    this.register('storage:config', mockStorage);
    this.register('object:test', Ember.Object.extend({
      settings: storageFor('config', { legacyKey: 'settings' })
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
  run(function() {
    assert.equal(subject.get('settings._storageType'), 'local');
    assert.equal(subject.get('settings._storageKey'), 'settings');
    assert.deepEqual(subject.get('settings._initialContent'), {
      token: 1234
    });
  });
});

test('serialized content can be used', function(assert) {
  assert.expect(2);
  run(function() {
    assert.equal(subject.get('settings.mapStyle'), 'dark');
  });
  // above runloop must finish first for changes to propagate
  run(function() {
    storageDeepEqual(assert, window.localStorage.settings, {
      mapStyle: 'dark',
      token: 1234
    });
  });
});
