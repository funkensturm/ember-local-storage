import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  storageEqual,
  storageDeepEqual
} from '../../helpers/storage';

module('Unit | Adapter | indices', function(hooks) {
  setupTest(hooks);

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  hooks.beforeEach(function() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('it persists the index', function(assert) {
    assert.expect(2);
    let adapter = this.owner.lookup('adapter:application');

    storageEqual(assert, window.localStorage['index-projects'], undefined);

    adapter._addToIndex('projects', '1234');
    storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
  });

  test('it does not persists duplicates to index', function(assert) {
    assert.expect(2);
    let adapter = this.owner.lookup('adapter:application');

    storageEqual(assert, window.localStorage['index-projects'], undefined);

    adapter._addToIndex('projects', '1234');
    adapter._addToIndex('projects', '1234');
    storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
  });

  test('it removes ids from index', function(assert) {
    assert.expect(3);
    let adapter = this.owner.lookup('adapter:application');

    storageEqual(assert, window.localStorage['index-projects'], undefined);

    adapter._addToIndex('projects', '1234');
    storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);

    adapter._removeFromIndex('projects', '1234');
    storageDeepEqual(assert, window.localStorage['index-projects'], []);
  });
});
