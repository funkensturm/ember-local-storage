import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';

const { run } = Ember;

const {
  AdapterError,
  Model,
  attr
} = DS;

let SimpleModel = Model.extend({
  prop: attr('string')
});

moduleFor('adapter:application', 'Unit | Adapter | application', {
  needs: [ 'serializer:application' ],

  beforeEach() {
    this.register('model:simple', SimpleModel);
    this.store = this.container.lookup('service:store');
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var adapter = this.subject();
  assert.ok(adapter);
});

test('it has a importData method', function(assert) {
  var adapter = this.subject();
  assert.ok(typeof adapter.importData === 'function');
});

test('it has a exportData method', function(assert) {
  var adapter = this.subject();
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
