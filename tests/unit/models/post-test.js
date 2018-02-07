import Ember from 'ember';
import DS from 'ember-data';
import { moduleForModel, test } from 'ember-qunit';
import {
  registerConfigEnvironment,
  setConfigEnvironment
} from '../../helpers/storage';

const {
  get,
  run
} = Ember;

moduleForModel('post', 'Unit | Model | post', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:application',
    'serializer:application',
    'model:comment',
    'model:user',
    'model:pet',
    'model:project',
    'model:book-publication'
  ],
  beforeEach: function() {
    registerConfigEnvironment(this);

    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});

test('it exists', function(assert) {
  let model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('create a record', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  run(function() {
    store.createRecord('post', { name: 'Super Name' }).save();
    store.createRecord('post', { name: 'Just awesome' }).save();
    store.createRecord('post', { name: 'Just a Name' }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
      done();
    });
});

test('push a record', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();

  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  run(function() {
    store.push({data: [
      {
        id: '1',
        type: 'post',
        attributes: {name: 'Super Name'}
      },
      {
        id: '2',
        type: 'post',
        attributes: {name: 'Totally rad'}
      }
    ]});
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
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

test('queryRecord empty store', function(assert) {
  assert.expect(2);
  const done = assert.async();
  const store = this.store();
  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  store.queryRecord('post', { filter: { name: 'Super Name' } })
    .then(function(post) {
      if (DS.VERSION.match(/^1\.13\./) || DS.VERSION.match(/^2\.[0|1]\./)) {
        assert.deepEqual(post, []);
      } else {
        assert.equal(post, null);
      }

      done();
    }).catch(function(error) {
      assert.ok(false, 'queryRecord on empty store throws error: ' + error.message);
      done();
    });
});

test('create a record (namespace: true)', function(assert) {
  assert.expect(1);

  setConfigEnvironment(this, 'namespace', true);

  const done = assert.async();
  const store = this.store();

  run(function() {
    store.createRecord('post', { name: 'Just a Name' }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});

test('create a record (namespace: "custom")', function(assert) {
  assert.expect(1);

  setConfigEnvironment(this, 'namespace', 'custom');

  const done = assert.async();
  const store = this.store();

  run(function() {
    store.createRecord('post', { name: 'Just a Name' }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});

test('create a record (keyDelimiter: "/")', function(assert) {
  assert.expect(1);

  setConfigEnvironment(this, 'namespace', 'custom');
  setConfigEnvironment(this, 'keyDelimiter', '/');

  const done = assert.async();
  const store = this.store();

  run(function() {
    store.createRecord('post', { name: 'Just a Name' }).save();
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
      done();
    });
});

test('push a record (namespace: true)', function(assert) {
  assert.expect(2);

  setConfigEnvironment(this, 'namespace', true);

  const done = assert.async();
  const store = this.store();

  let posts = store.findAll('post');

  assert.equal(get(posts, 'length'), 0);

  run(function() {
    store.push({data: [
      {
        id: '1',
        type: 'post',
        attributes: {name: 'Super Name'}
      },
      {
        id: '2',
        type: 'post',
        attributes: {name: 'Totally rad'}
      }
    ]});
  });

  store.findAll('post')
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});

test('find a single record (namespace: true)', function(assert) {
  assert.expect(2);

  setConfigEnvironment(this, 'namespace', true);

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
