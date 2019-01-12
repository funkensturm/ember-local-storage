import EmberObject from '@ember/object';
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

let subject;

module('legacy - config', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
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

    this.owner.register('storage:config', mockStorage);
    this.owner.register('object:test', EmberObject.extend({
      settings: storageFor('config', { legacyKey: 'settings' })
    }));
    subject = this.owner.lookup('object:test');
  });

  hooks.afterEach(function() {
    window.localStorage.clear();
    _resetStorages();
  });

  test('it has correct defaults', function(assert) {
    assert.expect(3);

    assert.equal(subject.get('settings._storageType'), 'local');
    assert.equal(subject.get('settings._storageKey'), 'settings');
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
});
