import EmberObject from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import StorageObject from 'ember-local-storage/local/object';
import { storageFor, _resetStorages } from 'ember-local-storage/helpers/storage';

let subject;

module('storageFor - DI', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register(
      'service:backend',
      Service.extend({
        name: 'Backend Name',
      })
    );

    let mockStorage = StorageObject.extend({
      backend: service(),
    });

    mockStorage.reopenClass({
      initialState() {
        return {
          perPage: 10,
        };
      },
    });

    this.owner.register('storage:settings', mockStorage);

    this.owner.register(
      'object:test',
      EmberObject.extend({
        settings: storageFor('settings'),
      })
    );
    subject = this.owner.lookup('object:test');
  });

  hooks.afterEach(function () {
    window.localStorage.clear();
    _resetStorages();
  });

  test('DI is working in a storage', function(assert) {
    assert.expect(1);

    assert.equal(subject.get('settings.backend.name'), 'Backend Name');
  });
});
