import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import { moduleForModel, test } from 'ember-qunit';

const {
  get,
  run
} = Ember;

moduleForModel('blog/post', 'Unit | Model | blog/post', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:blog/post',
    'serializer:application',
    'model:comment',
    'model:user',
  ],
  beforeEach: function() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('create a namespaced record', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  let posts = store.findAll('blog/post');

  assert.equal(get(posts, 'length'), 0);

  run(function() {
    store.createRecord('blog/post', { name: 'Super Name' }).save();
    store.createRecord('blog/post', { name: 'Just awesome' }).save();
    store.createRecord('blog/post', { name: 'Just a Name' }).save();
  });

  store.findAll('blog/post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
      done();
    });
});

test('push a namespaced record', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  let posts = store.findAll('blog/post');

  assert.equal(get(posts, 'length'), 0);

  run(function() {
    store.push({data: [
      {
        id: '1',
        type: 'blog/post',
        attributes: {name: 'Super Name'}
      },
      {
        id: '2',
        type: 'blog/post',
        attributes: {name: 'Totally rad'}
      }
    ]});
  });

  store.findAll('blog/post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});

test('find a single namespaced record', function(assert) {
  const done = assert.async();
  const store = this.store();
  assert.expect(2);
  const newPost = run(store, 'createRecord', 'blog/post', {
    name: 'Ember.js: 10 most common mistakes'
  });
  wait().then(() => {
    return run(newPost, 'save');
  }).then(() => {
    store.find('blog/post', get(newPost, 'id')).then((post) => {
      assert.equal(get(post, 'id'), get(newPost, 'id'));
      assert.equal(get(post, 'name'), 'Ember.js: 10 most common mistakes');
      done();
    }).catch((err) => {
      assert.ok(false, err);
      done();
    });
  });
});

test('namespaced get all', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();
  store.findAll('blog/post').then((posts) => {
    assert.equal(get(posts, 'length'), 0);
    return run(store, 'createRecord', 'blog/post', {
      name: 'Ember.js: 10 most common mistakes'
    });
  }).then(() => {
    return run(store, 'createRecord', 'blog/post', {
      name: 'Ember.js: Ember-CPM'
    });
  }).then(() => {
    return store.findAll('blog/post');
  }).then((posts) => {
    assert.equal(get(posts, 'length'), 2);
    done();
  });
});

test('namespaced queryRecord attributes', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  store.findAll('blog/post').then((posts) => {
    assert.equal(get(posts, 'length'), 0);
    return run(store, 'createRecord', 'blog/post', { name: 'Super Name' }).save();
  }).then(() => {
    return run(store, 'createRecord', 'blog/post', { name: 'Just a Name' }).save();
  }).then(() => {
    return run(store, 'createRecord', 'blog/post', { name: 'Just a Name' }).save();
  }).then(() => {
    return store.findAll('blog/post');
  }).then((posts) => {
    assert.equal(get(posts, 'length'), 3);
    return store.queryRecord('blog/post', { filter: { name: 'Super Name' } });
  }).then((post) => {
    assert.equal(get(post, 'name'), 'Super Name');
    done();
  }).catch((err) => {
    assert.ok(false, err);
    done();
  });
});
