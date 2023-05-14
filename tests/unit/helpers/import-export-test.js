import { hash } from 'rsvp';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import testData from '../../helpers/test-data';
import SessionStorageAdapter from 'ember-local-storage/adapters/session';
import {
  importData,
  exportData,
} from 'ember-local-storage/helpers/import-export';

module('Unit | Helpers | import/export', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('import', function (assert) {
    assert.expect(2);
    const store = this.owner.lookup('service:store');

    return run(function () {
      return importData(store, testData.importFileContent);
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
        assert.equal(get(data.posts, 'length'), 2);
        assert.equal(get(data.comments, 'length'), 3);
      });
  });

  test('import with records loaded', function (assert) {
    assert.expect(2);
    const store = this.owner.lookup('service:store');

    return run(function () {
      return hash({
        posts: store.findAll('post'),
        comments: store.findAll('comment'),
      });
    })
      .then(function () {
        return importData(store, testData.importFileContent);
      })
      .then(function () {
        return hash({
          posts: store.findAll('post'),
          comments: store.findAll('comment'),
        });
      })
      .then(function (data) {
        assert.equal(get(data.posts, 'length'), 2);
        assert.equal(get(data.comments, 'length'), 3);
      });
  });

  test('import to multiple adapter types', function (assert) {
    assert.expect(4);
    this.owner.register('adapter:post', SessionStorageAdapter);

    const store = this.owner.lookup('service:store');

    return run(function () {
      return importData(store, testData.importFileContent);
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
        assert.equal(get(data.posts, 'length'), 2);
        assert.equal(get(data.comments, 'length'), 3);
        assert.equal(
          JSON.parse(window.localStorage['index-comments']).length,
          3
        );
        assert.equal(
          JSON.parse(window.sessionStorage['index-posts']).length,
          2
        );
      });
  });

  test('export', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');

    return run(function () {
      return importData(store, testData.importFileContent);
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
        return exportData(store, ['posts', 'comments'], { json: false });
      })
      .then(function (data) {
        assert.equal(data.data.length, 5);
      });
  });

  test('export from multiple adapter types', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    this.owner.register('adapter:post', SessionStorageAdapter);

    return run(function () {
      return importData(store, testData.importFileContent);
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
        return exportData(store, ['posts', 'comments'], { json: false });
      })
      .then(function (data) {
        assert.equal(data.data.length, 5);
      });
  });
});
