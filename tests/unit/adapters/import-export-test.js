import { hash } from 'rsvp';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import testData from '../../helpers/test-data';
import { initialize } from 'ember-local-storage/initializers/local-storage-adapter';
import SessionStorageAdapter from 'ember-local-storage/adapters/session';

module('Unit | Adapter | import/export', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    initialize();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('import', function(assert) {
    assert.expect(2);
    const store = this.owner.lookup('service:store');

    return run(function() {
      return store.importData(testData.importFileContent);
    })
      .then(function () {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        return hash({
          posts: posts,
          comments: comments,
        });
      })
      .then(function (data) {
        assert.equal(data.posts.length, 2);
        assert.equal(data.comments.length, 3);
      });
  });

  test('import with records loaded', function(assert) {
    assert.expect(2);
    const store = this.owner.lookup('service:store');

    return run(function() {
      return hash({
        posts: store.findAll('post'),
        comments:  store.findAll('comment')
      });
    }).then(function() {
      return store.importData(testData.importFileContent);
    }).then(function() {
      return hash({
        posts: store.findAll('post'),
        comments: store.findAll('comment'),
      });
    }).then(function(data) {
      assert.equal(data.posts.length, 2);
      assert.equal(data.comments.length, 3);
    });
  });

  test('import to multiple adapter types', function(assert) {
    assert.expect(4);
    this.owner.register('adapter:post', SessionStorageAdapter);

    const store = this.owner.lookup('service:store');

    return run(function() {
      return store.importData(testData.importFileContent);
    })
      .then(function () {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        return hash({
          posts: posts,
          comments: comments,
        });
      })
      .then(function (data) {
        assert.equal(data.posts.length, 2);
        assert.equal(data.comments.length, 3);
        assert.equal(JSON.parse(window.localStorage['index-comments']).length, 3);
        assert.equal(JSON.parse(window.sessionStorage['index-posts']).length, 2);
      });
  });

  test('export', function(assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');

    return run(function() {
      return store.importData(testData.importFileContent);
    })
      .then(function () {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        return hash({
          posts: posts,
          comments: comments,
        });
      })
      .then(function () {
        return store.exportData(['posts', 'comments'], { json: false });
      })
      .then(function (data) {
        assert.equal(data.data.length, 5);
      });
  });

  test('export from multiple adapter types', function(assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    this.owner.register('adapter:post', SessionStorageAdapter);

    return run(function() {
      return store.importData(testData.importFileContent);
    })
      .then(function () {
        const posts = store.findAll('post');
        const comments = store.findAll('comment');

        return hash({
          posts: posts,
          comments: comments,
        });
      })
      .then(function () {
        return store.exportData(['posts', 'comments'], { json: false });
      })
      .then(function (data) {
        assert.equal(data.data.length, 5);
      });
  });
});
