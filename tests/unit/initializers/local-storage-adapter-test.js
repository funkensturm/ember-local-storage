import Ember from 'ember';
import DS from 'ember-data';
import { initialize } from '../../../initializers/local-storage-adapter';
import { module, test } from 'qunit';

var application;

module('Unit | Initializer | local storage adapter', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

test('it adds importData to DS.Store', function(assert) {
  initialize();

  const store = DS.Store.create();

  assert.ok(typeof store.importData === 'function');
});

test('it adds exportData to DS.Store', function(assert) {
  initialize();

  const store = DS.Store.create();

  assert.ok(typeof store.exportData === 'function');
});