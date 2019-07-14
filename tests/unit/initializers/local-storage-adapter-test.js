import Application from '@ember/application';
import { run } from '@ember/runloop';
import DS from 'ember-data';
import { initialize } from '../../../initializers/local-storage-adapter';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | local storage adapter', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
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
});