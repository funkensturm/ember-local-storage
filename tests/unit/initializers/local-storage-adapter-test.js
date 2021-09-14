import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { initialize } from '../../../initializers/local-storage-adapter';

let store;

module('Unit | Initializer | local storage adapter', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  hooks.afterEach(function () {
    store = null;
  });

  test('it adds importData to DS.Store', function(assert) {
    initialize();

    assert.strictEqual(typeof store.importData, 'function');
  });

  test('it adds exportData to DS.Store', function(assert) {
    initialize();

    assert.strictEqual(typeof store.exportData, 'function');
  });
});
