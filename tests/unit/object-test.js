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

test('reset method restores initialContent', function(assert) {
  var Local = LocalStorageObject.extend(config);
  var local = Local.create();

  assert.expect(5);

  //initialContent is set properly
  assert.deepEqual(local.get('content'), {
    token: null
  });

  //set new properties and overwrite others
  Ember.run(function() {
    local.set('newProp', 'some-value');
    local.set('token', 'new-token');
  });

  //we expect them to be present
  assert.equal(local.get('newProp'), 'some-value');
  assert.equal(local.get('token'), 'new-token');

  //reset
  local.reset();

  //data is back to initial values
  assert.deepEqual(local.get('content'), {
    token: null
  });
  assert.strictEqual(local.get('newProp'), undefined);

});

test('it updates _isInitialContent', function(assert) {
  assert.expect(2);

  const Local = LocalStorageObject.extend(config),
    local = Local.create();

  assert.equal(local.isInitialContent(), true);

  Ember.run(function() {
    local.set('token', '12345');
  });

  assert.equal(local.isInitialContent(), false);
});

test('it updates _isInitialContent on reset', function(assert) {
  assert.expect(2);

  const Local = LocalStorageObject.extend(config),
    local = Local.create();

  Ember.run(function() {
    local.set('token', '12345');
  });

  assert.equal(local.isInitialContent(), false);

  Ember.run(function() {
    local.reset();
  });

  assert.equal(local.isInitialContent(), true);
});
