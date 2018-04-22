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

const {
  get
} = Ember;

let subject;

moduleFor('router:main', 'legacy - config', {
  beforeEach() {
    // old serialized content
    window.localStorage['localforage/settings'] = JSON.stringify({
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
  const done = assert.async();
  assert.expect(3);
  get(subject, 'settings').then((storage) => {
    assert.equal(get(storage, '_storageType'), 'local');
    assert.equal(get(storage, '_storageKey'), 'settings');
    assert.deepEqual(get(storage, '_initialContent'), { token: 1234 });
    done();
  });
});

test('serialized content can be used', function(assert) {
  const done = assert.async();
  const storageKey = 'localforage/settings';
  assert.expect(3);
  get(subject, 'settings').then((storage) => {
    assert.equal(get(storage, 'token'), 1234);
    assert.equal(get(storage, 'mapStyle'), 'dark');
    storageDeepEqual(assert, window.localStorage[storageKey], { mapStyle: 'dark', token: 1234 });
    done();
  });
});
