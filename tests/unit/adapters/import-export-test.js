import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';
import testData from '../../helpers/test-data';
import { initialize } from 'ember-local-storage/initializers/local-storage-adapter';
import SessionStorageAdapter from 'ember-local-storage/adapters/session';

const {
  get,
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
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('import', function(assert) {
  assert.expect(2);
  const store = this.store();

  return run(function() {
    return store.importData(testData.importFileContent);
  }).then(function() {
    const posts = store.findAll('post');
    const comments = store.findAll('comment');

    return Ember.RSVP.hash({
      posts: posts,
      comments: comments
    });
  }).then(function(data) {
    assert.equal(get(data.posts, 'length'), 2);
    assert.equal(get(data.comments, 'length'), 3);
  });
});

test('import with records loaded', function(assert) {
  assert.expect(2);
  const store = this.store();

  return run(function() {
    return Ember.RSVP.hash({
      posts: store.findAll('post'),
      comments:  store.findAll('comment')
    });
  }).then(function() {
    return store.importData(testData.importFileContent);
  }).then(function() {
    return Ember.RSVP.hash({
      posts: store.findAll('post'),
      comments:  store.findAll('comment')
    });
  }).then(function(data) {
    assert.equal(get(data.posts, 'length'), 2);
    assert.equal(get(data.comments, 'length'), 3);
  });
});

test('import to multiple adapter types', function(assert) {
  assert.expect(4);
  this.register('adapter:post', SessionStorageAdapter);

  const store = this.store();

  return run(function() {
    return store.importData(testData.importFileContent);
  }).then(function() {
    const posts = store.findAll('post');
    const comments = store.findAll('comment');

    return Ember.RSVP.hash({
      posts: posts,
      comments: comments
    });
  }).then(function(data) {
    assert.equal(get(data.posts, 'length'), 2);
    assert.equal(get(data.comments, 'length'), 3);
    assert.equal(JSON.parse(window.localStorage['localforage/index-comments']).length, 3);
    assert.equal(JSON.parse(window.sessionStorage['localforage/index-posts']).length, 2);
  });
});

test('export', function(assert) {
  assert.expect(1);
  const store = this.store();

  return run(function() {
    return store.importData(testData.importFileContent);
  }).then(function() {
    const posts = store.findAll('post');
    const comments = store.findAll('comment');

    return Ember.RSVP.hash({
      posts: posts,
      comments: comments
    });
  }).then(function() {
    return store.exportData(
      ['posts', 'comments'],
      {json: false}
    );
  }).then(function(data) {
    assert.equal(data.data.length, 5);
  });
});

test('export from multiple adapter types', function(assert) {
  assert.expect(1);
  const store = this.store();
  this.register('adapter:post', SessionStorageAdapter);

  return run(function() {
    return store.importData(testData.importFileContent);
  }).then(function() {
    const posts = store.findAll('post');
    const comments = store.findAll('comment');

    return Ember.RSVP.hash({
      posts: posts,
      comments: comments
    });
  }).then(function() {
    return store.exportData(
      ['posts', 'comments'],
      {json: false}
    );
  }).then(function(data) {
    assert.equal(data.data.length, 5);
  });
});
