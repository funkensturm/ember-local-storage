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
    'model:comment',
    'model:user'
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


  run(function() {
    store.createRecord('post', {
      name: 'Ember.js: 10 most common mistakes'
    }).save();

    store.createRecord('post', {
      name: 'Ember.js: Ember-CPM'
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});

test('query attributes', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let paul;

  run(function() {
    paul = store.createRecord('user', {
      name: 'Paul'
    });
    paul.save();
  });

  run(function() {
    store.createRecord('post', {
      name: 'Super Name',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just a Name',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just a Name',
      user: paul
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  store.query('post', { filter: { name: 'Super Name' } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});

test('query attributes with regex', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let paul;

  run(function() {
    paul = store.createRecord('user', {
      name: 'Paul'
    });
    paul.save();
  });

  run(function() {
    store.createRecord('post', {
      name: 'Super Name',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just awesome',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just a Name',
      user: paul
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  store.query('post', { filter: { name: /^Just(.*)/ } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});


test('query belongsTo relationship', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let paul, moritz;

  run(function() {
    paul = store.createRecord('user', {
      name: 'Paul'
    });
    paul.save();

    moritz = store.createRecord('user', {
      name: 'Moritz'
    });
    moritz.save();
  });

  run(function() {
    store.createRecord('post', {
      name: 'Ember.js: 10 most common mistakes',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Ember.js: Ember-CPM',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Ember.js: Testing with Ember PageObjects',
      user: moritz
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  store.query('post', { filter: { userId: get(paul, 'id') } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});

test('query hasMany relationship', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let paul, comment;

  run(function() {
    paul = store.createRecord('user', {
      name: 'Paul'
    });
    paul.save();

    comment = store.createRecord('comment', {
      name: 'I like it'
    });
    comment.save();
  });

  run(function() {
    store.createRecord('post', {
      name: 'Ember.js: 10 most common mistakes',
      user: paul,
      comments: [comment]
    }).save();

    store.createRecord('post', {
      name: 'Ember.js: Testing with Ember PageObjects',
      user: paul
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  store.query('post', { filter: { commentId: get(comment, 'id') } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});

test('queryRecord attributes', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  let paul;

  run(function() {
    paul = store.createRecord('user', {
      name: 'Paul'
    });
    paul.save();
  });

  run(function() {
    store.createRecord('post', {
      name: 'Super Name',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just a Name',
      user: paul
    }).save();

    store.createRecord('post', {
      name: 'Just a Name',
      user: paul
    }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  store.queryRecord('post', { filter: { name: 'Super Name' } })
    .then(function(post) {
      assert.equal(get(post, 'name'), 'Super Name');
      done();
    });
});