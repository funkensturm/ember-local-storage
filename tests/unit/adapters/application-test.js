import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:application', 'Unit | Adapter | application', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
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