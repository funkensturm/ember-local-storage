import Ember from 'ember';
import { module, test } from 'qunit';

import SessionStorageObject from 'ember-local-storage/session/object';
import LocalStorageObject from 'ember-local-storage/local/object';

import config from 'dummy/models/config';

module('object - config', {
  afterEach: function() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('it does not share data', function(assert) {
  var Session = SessionStorageObject.extend(config),
    Local = LocalStorageObject.extend(config),
    session, local;

  assert.expect(10);

  session = Session.create();

  assert.equal(session.get('_storage'), 'session');
  assert.equal(session.get('storageKey'), 'api-token');
  assert.deepEqual(session.get('initialContent'), {
    token: null
  });

  Ember.run(function() {
    session.set('token', '123456');
  });

  assert.deepEqual(session.get('token'), '123456');

  local = Local.create();

  assert.equal(local.get('_storage'), 'local');
  assert.equal(local.get('storageKey'), 'api-token');
  assert.deepEqual(local.get('initialContent'), {
    token: null
  });

  assert.deepEqual(session.get('token'), '123456');

  Ember.run(function() {
    local.set('token', 'abcde');
  });

  assert.deepEqual(local.get('token'), 'abcde');

  assert.deepEqual(session.get('token'), '123456');
});
