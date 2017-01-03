import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import testData from '../../helpers/test-data';
import { initialize } from 'ember-local-storage/initializers/local-storage-adapter';

const {
  get,
  getOwner,
  run
} = Ember;

moduleForModel('post', 'Unit | Adapter | import/export', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:application',
    'serializer:application',
    'model:comment'
  ],
  beforeEach: function() {
    initialize();
    const adapter = getOwner(this).lookup('adapter:application');
    adapter._getIndex('posts').reset();
    adapter._getIndex('comments').reset();

    window.localStorage.clear();
  }
});

test('import', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  run(function() {
    store.importData(testData.importFileContent)
      .then(function() {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        Ember.RSVP
          .hash({
            posts: posts,
            comments: comments
          })
          .then(function(data) {
            assert.equal(get(data.posts, 'length'), 2);
            assert.equal(get(data.comments, 'length'), 3);
            done();
          });
      });
  });
});

test('import', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const store = this.store();

  run(function() {
    store.importData(testData.importFileContent)
      .then(function() {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        Ember.RSVP
          .hash({
            posts: posts,
            comments: comments
          })
          .then(function() {
            store.exportData(
              ['posts', 'comments'],
              {json: false}
            )
            .then(function(data) {
              assert.equal(data.data.length, 5);
              done();
            });
          });
      });
  });
});
