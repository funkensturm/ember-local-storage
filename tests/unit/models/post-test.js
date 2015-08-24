import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

const get = Ember.get;

const {
  run
} = Ember;

moduleForModel('post', 'Unit | Model | post', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:application',
    'serializer:application',
    'model:comment'
  ],
  beforeEach: function() {
    const adapter = this.container.lookup('adapter:application');
    adapter._getIndex('posts').reset();

    window.localStorage.clear();
  }
});

test('it exists', function(assert) {
  let model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('find a single record', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  let newPost;

  run(function() {
    newPost = store.createRecord('post', {
      name: 'Ember.js: 10 most common mistakes'
    });

    newPost.save();
  });

  run(function() {
    store.find('post', get(newPost, 'id'))
      .then(function(post) {
        assert.equal(get(post, 'id'), get(newPost, 'id'));
        assert.equal(get(post, 'name'), 'Ember.js: 10 most common mistakes');
        done();
      });
  });
});

test('get all', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let newPost;

  run(function() {
    newPost = store.createRecord('post', {
      name: 'Ember.js: 10 most common mistakes'
    });

    newPost.save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});