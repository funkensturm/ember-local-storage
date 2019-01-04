import { moduleFor, test } from 'ember-qunit';
import {
  storageEqual,
  storageDeepEqual,
  registerConfigEnvironment,
  setConfigEnvironment
} from '../../helpers/storage';

moduleFor('adapter:application', 'Unit | Adapter | indices', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach: function() {
    registerConfigEnvironment(this);

    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('it persists the index', function(assert) {
  assert.expect(2);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
});

test('it does not persists duplicates to index', function(assert) {
  assert.expect(2);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  adapter._addToIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
});

test('it removes ids from index (namespace not set)', function(assert) {
  assert.expect(3);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);

  adapter._removeFromIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], []);
});

test('it removes ids from index (namespace: true)', function(assert) {
  assert.expect(3);

  setConfigEnvironment(this, 'namespace', true);

  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  storageDeepEqual(
    assert,
    window.localStorage['my-app:index-projects'],
    ['1234']
  );

  adapter._removeFromIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['my-app:index-projects'], []);
});

test('it removes ids from index (namespace: "custom")', function(assert) {
  assert.expect(3);

  setConfigEnvironment(this, 'namespace', 'custom');

  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  storageDeepEqual(
    assert,
    window.localStorage['custom:index-projects'],
    ['1234']
  );

  adapter._removeFromIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['custom:index-projects'], []);
});

test('it removes ids from index (keyDelimiter: "/")', function(assert) {
  assert.expect(3);

  setConfigEnvironment(this, 'namespace', true);
  setConfigEnvironment(this, 'keyDelimiter', '/');

  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  adapter._addToIndex('projects', '1234');
  storageDeepEqual(
    assert,
    window.localStorage['my-app/index-projects'],
    ['1234']
  );

  adapter._removeFromIndex('projects', '1234');
  storageDeepEqual(assert, window.localStorage['my-app/index-projects'], []);
});
