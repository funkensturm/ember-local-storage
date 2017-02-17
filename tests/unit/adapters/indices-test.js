import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import {
  storageEqual,
  storageDeepEqual
} from '../../helpers/storage';
import run from 'ember-runloop';

const {
  getOwner
} = Ember;

moduleFor('adapter:application', 'Unit | Adapter | indices', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach: function() {
    const adapter = getOwner(this).lookup('adapter:application');

    ['projects'].forEach(function(key) {
      run(adapter._getIndex(key), 'reset');
    });

    window.localStorage.clear();
  }
});

test('it persists the index', function(assert) {
  assert.expect(2);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  run(adapter, '_addToIndex', 'projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
});

test('it does not persists duplicates to index', function(assert) {
  assert.expect(2);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  run(adapter, '_addToIndex', 'projects', '1234');
  run(adapter, '_addToIndex', 'projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);
});

test('it removes ids from index', function(assert) {
  assert.expect(3);
  var adapter = this.subject();

  storageEqual(assert, window.localStorage['index-projects'], undefined);

  run(adapter, '_addToIndex', 'projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], ['1234']);

  run(adapter, '_removeFromIndex', 'projects', '1234');
  storageDeepEqual(assert, window.localStorage['index-projects'], []);
});
