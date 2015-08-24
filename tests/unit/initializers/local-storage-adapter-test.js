import Ember from 'ember';
import { initialize } from '../../../initializers/local-storage-adapter';
import { module, test } from 'qunit';

var registry, application;

module('Unit | Initializer | local storage adapter', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      registry = application.registry;
      application.deferReadiness();
    });
  }
});

test('it adds importData to DS.Store', function(assert) {
  initialize(registry, application);

  const store = DS.Store.create();

  assert.ok(typeof store.importData === 'function');
});

test('it adds exportData to DS.Store', function(assert) {
  initialize(registry, application);

  const store = DS.Store.create();

  assert.ok(typeof store.exportData === 'function');
});