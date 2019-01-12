import { run } from '@ember/runloop';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const {
  AdapterError,
  Model,
  attr
} = DS;

let SimpleModel = Model.extend({
  prop: attr('string')
});

module('Unit | Adapter | application', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('model:simple', SimpleModel);
    this.store = this.owner.lookup('service:store');
  });

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var adapter = this.owner.lookup('adapter:application');
    assert.ok(adapter);
  });

  test('it has a importData method', function(assert) {
    var adapter = this.owner.lookup('adapter:application');
    assert.ok(typeof adapter.importData === 'function');
  });

  test('it has a exportData method', function(assert) {
    var adapter = this.owner.lookup('adapter:application');
    assert.ok(typeof adapter.exportData === 'function');
  });

  test('it handles requests for missing records', function(assert) {
    assert.expect(1);

    return run(() => {
      return this.store.findRecord('simple', '12345').then(() => {
        assert.notOk(true, "should not have succeeded");
      }).catch((e) => {
        assert.ok(e instanceof AdapterError, "an adapter error was thrown");
      });
    });
  });
});
