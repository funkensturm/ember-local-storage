import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

const get = Ember.get;

const {
  run
} = Ember;

moduleForModel('post', 'Unit | Model | query', {
  // Specify the other units that are required for this test.
  needs: [
    'adapter:application',
    'serializer:application',
    'model:project',
    'model:book-publication',
    'model:comment',
    'model:user',
    'model:editor',
    'model:pet',
    'model:cat',
    'model:dog'
  ],
  beforeEach: function() {
    const adapter = this.container.lookup('adapter:application');

    ['posts', 'users', 'projects', 'comments', 'pets'].forEach(function(key) {
      adapter._getIndex(key).reset();
    });

    window.localStorage.clear();
  }
});

test('attributes (string, regex, boolean, number)', function(assert) {
  assert.expect(5);
  const done = assert.async();
  const store = this.store();

  run(function() {
    // Create records
    store.createRecord('post', {
      name: 'Super Name',
      commentCount: 3
    }).save();
    store.createRecord('post', {
      name: 'Just awesome',
      commentCount: 1
    }).save();
    store.createRecord('post', {
      name: 'Just a Name',
      commentCount: 3
    }).save();
    store.createRecord('post', {
      commentCount: 2,
      isPrivate: false
    }).save();
    store.createRecord('post', {
      commentCount: 0
    }).save();
  });

  // string
  store.query('post', { filter: { name: 'Super Name' } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
    });

  // boolean
  store.query('post', { filter: { isPrivate: false } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
    });

  // number
  store.query('post', { filter: { commentCount: 3 } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // regex
  store.query('post', { filter: { name: /^Just(.*)/ } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // camelized key
  store.query('post', { filter: { commentCount: 3 } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});


test('belongsTo relationship', function(assert) {
  assert.expect(8);
  const done = assert.async();
  const store = this.store();

  let paul, peter, moritz;

  run(function() {
    // Create users
    paul = store.createRecord('editor', { name: 'Paul' });
    peter = store.createRecord('editor', { name: 'Peter' });
    moritz = store.createRecord('user', { name: 'Moritz' });

    // Create posts
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
      user: peter
    }).save();

    store.createRecord('post', {
      name: 'ES6',
      user: moritz
    }).save();
  });

  const id = get(paul, 'id'),
    regexId = new RegExp('^' + id + '$');

  // get posts from user '123'
  // string
  store.query('post', { filter: { user: id } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // object
  store.query('post', { filter: { user: { id: id } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // regex
  store.query('post', { filter: { user: regexId } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // object regex
  store.query('post', { filter: { user: { id: regexId } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // polymorphic
  // get posts from editors
  store.query('post', { filter: { user: { type: 'editor' } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });
  // regex
  store.query('post', { filter: { user: { type: /^ed(.*)ors$/ } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  // get posts from editor '123'
  store.query('post', { filter: { user: { id: id, type: 'editor' } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2, 'nuu');
    });
  // regex
  store.query('post', { filter: { user: { id: id, type: /^ed(.*)ors$/ } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2, 'ups');
      done();
    });
});

test('hasMany relationship', function(assert) {
  assert.expect(9);
  const done = assert.async();
  const store = this.store();

  let anna, peter, moritz, project, bookPublication, cat, dog, dog2;

  run(function() {
    project = store.createRecord('project', {
      name: 'Componentize all the things!'
    });

    bookPublication = store.createRecord('book-publication', {
      name: 'Books For Dummies'
    });

    cat = store.createRecord('cat', { name: 'Cat name' });
    dog = store.createRecord('dog', { name: 'Dog name' });
    dog2 = store.createRecord('dog', { name: 'Dog name 2' });

    anna = store.createRecord('user', {
      name: 'Anna',
      pets: [cat]
    });
    anna.save();

    peter = store.createRecord('user', {
      name: 'Peter',
      pets: [dog2],
      projects: [project],
      bookPublications: [bookPublication]
    });
    peter.save();

    moritz = store.createRecord('user', {
      name: 'Moritz',
      pets: [cat, dog],
      projects: [project],
      bookPublications: [bookPublication]
    });
    moritz.save();

    project.save();
    cat.save();
    dog.save();
    dog2.save();
  });

  const id = get(project, 'id'),
    regexId = new RegExp('^' + id + '$');

  // get users who've contributed to project.id = 123
  // string
  store.query('user', { filter: { projects: id } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // object
  store.query('user', { filter: { projects: { id: id } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // regex
  store.query('user', { filter: { projects: regexId } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // object regex
  store.query('user', { filter: { projects: { id: regexId } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // polymorphic
  // get users with cats
  store.query('user', { filter: { pets: { type: 'cat' } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // get users with cat '123'
  store.query('user', { filter: { pets: { id: get(cat, 'id'), type: 'cat' } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
    });

  // get users with cats AND dogs
  store.query('user', { filter: { pets: [{ type: 'cat' }, { type: 'dog' }] } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 1);
    });

  // get users with cats OR dogs
  store.query('user', { filter: { pets: { type: /cats|dogs/ } } })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 3);
    });

  // get the users with superHeroes '123' (camelcased key)
  store.query('user', {
      filter: { bookPublications: get(bookPublication, 'id') }
    })
    .then(function(posts) {
      assert.equal(get(posts, 'length'), 2);
      done();
    });
});
