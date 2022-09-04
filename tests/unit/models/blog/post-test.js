import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | blog/post', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('create a namespaced record', function (assert) {
    assert.expect(2);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    let posts = store.findAll('blog/post');

    assert.equal(get(posts, 'length'), 0);

    run(function () {
      store.createRecord('blog/post', { name: 'Super Name' }).save();
      store.createRecord('blog/post', { name: 'Just awesome' }).save();
      store.createRecord('blog/post', { name: 'Just a Name' }).save();
    });

    store.findAll('blog/post').then(function (posts) {
      assert.equal(get(posts, 'length'), 3);
      done();
    });
  });

  test('push a namespaced record', function (assert) {
    assert.expect(2);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    let posts = store.findAll('blog/post');

    assert.equal(get(posts, 'length'), 0);

    run(function () {
      store.push({
        data: [
          {
            id: '1',
            type: 'blog/post',
            attributes: { name: 'Super Name' },
          },
          {
            id: '2',
            type: 'blog/post',
            attributes: { name: 'Totally rad' },
          },
        ],
      });
    });

    store.findAll('blog/post').then(function (posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
  });

  test('find a single namespaced record', function (assert) {
    assert.expect(2);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    let newPost;

    run(function () {
      newPost = store.createRecord('blog/post', {
        name: 'Ember.js: 10 most common mistakes',
      });

      newPost.save();
    });

    run(function () {
      store.findRecord('blog/post', get(newPost, 'id')).then(function (post) {
        assert.equal(get(post, 'id'), get(newPost, 'id'));
        assert.equal(get(post, 'name'), 'Ember.js: 10 most common mistakes');
        done();
      });
    });
  });

  test('namespaced get all', function (assert) {
    assert.expect(2);
    const done = assert.async();
    const store = this.owner.lookup('service:store');
    let posts = store.findAll('blog/post');

    assert.equal(get(posts, 'length'), 0);

    run(function () {
      store
        .createRecord('blog/post', {
          name: 'Ember.js: 10 most common mistakes',
        })
        .save();

      store
        .createRecord('blog/post', {
          name: 'Ember.js: Ember-CPM',
        })
        .save();
    });

    store.findAll('blog/post').then(function (posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
  });

  test('namespaced queryRecord attributes', function (assert) {
    assert.expect(3);
    const done = assert.async();
    const store = this.owner.lookup('service:store');
    let posts = store.findAll('blog/post');

    assert.equal(get(posts, 'length'), 0);

    run(function () {
      store
        .createRecord('blog/post', {
          name: 'Super Name',
        })
        .save();

      store
        .createRecord('blog/post', {
          name: 'Just a Name',
        })
        .save();

      store
        .createRecord('blog/post', {
          name: 'Just a Name',
        })
        .save();
    });

    store.findAll('blog/post').then(function (posts) {
      assert.equal(get(posts, 'length'), 3);
    });

    store
      .queryRecord('blog/post', { filter: { name: 'Super Name' } })
      .then(function (post) {
        assert.equal(get(post, 'name'), 'Super Name');
        done();
      });
  });
});
