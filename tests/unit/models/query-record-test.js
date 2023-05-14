import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | queryRecord', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('attributes (string, regex, boolean, number)', function (assert) {
    assert.expect(5);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    run(function () {
      // Create records
      store
        .createRecord('post', {
          name: 'Super Name',
          commentCount: 3,
        })
        .save();
      store
        .createRecord('post', {
          name: 'Just awesome',
          commentCount: 1,
        })
        .save();
      store
        .createRecord('post', {
          name: 'Just a Name',
          commentCount: 3,
        })
        .save();
      store
        .createRecord('post', {
          commentCount: 2,
          isPrivate: false,
        })
        .save();
      store
        .createRecord('post', {
          commentCount: 0,
        })
        .save();
    });

    // string
    store
      .queryRecord('post', { filter: { name: 'Super Name' } })
      .then(function (post) {
        assert.strictEqual(get(post, 'name'), 'Super Name');
      });

    // boolean
    store
      .queryRecord('post', { filter: { isPrivate: false } })
      .then(function (post) {
        assert.false(get(post, 'isPrivate'));
      });

    // number
    store
      .queryRecord('post', { filter: { commentCount: 3 } })
      .then(function (post) {
        assert.strictEqual(get(post, 'commentCount'), 3);
      });

    // regex
    store
      .queryRecord('post', { filter: { name: /^Just(.*)/ } })
      .then(function (post) {
        assert.strictEqual(get(post, 'name'), 'Just awesome');
      });

    // camelized key
    store
      .queryRecord('post', { filter: { commentCount: 3 } })
      .then(function (post) {
        assert.strictEqual(get(post, 'commentCount'), 3);
        done();
      });
  });

  test('belongsTo relationship', function (assert) {
    assert.expect(8);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    let paul, peter, moritz;

    run(function () {
      // Create users
      paul = store.createRecord('editor', { name: 'Paul' });
      peter = store.createRecord('editor', { name: 'Peter' });
      moritz = store.createRecord('user', { name: 'Moritz' });

      // Create posts
      store
        .createRecord('post', {
          name: 'Ember.js: 10 most common mistakes',
          user: paul,
        })
        .save();

      store
        .createRecord('post', {
          name: 'Ember.js: Ember-CPM',
          user: paul,
        })
        .save();

      store
        .createRecord('post', {
          name: 'Ember.js: Testing with Ember PageObjects',
          user: peter,
        })
        .save();

      store
        .createRecord('post', {
          name: 'ES6',
          user: moritz,
        })
        .save();
    });

    const id = get(peter, 'id'),
      regexId = new RegExp('^' + id + '$');

    // get first post from user '123'
    // string
    store.queryRecord('post', { filter: { user: id } }).then(function (post) {
      assert.strictEqual(
        get(post, 'name'),
        'Ember.js: Testing with Ember PageObjects'
      );
    });

    // object
    store
      .queryRecord('post', { filter: { user: { id: id } } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: Testing with Ember PageObjects'
        );
      });

    // regex
    store
      .queryRecord('post', { filter: { user: regexId } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: Testing with Ember PageObjects'
        );
      });

    // object regex
    store
      .queryRecord('post', { filter: { user: { id: regexId } } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: Testing with Ember PageObjects'
        );
      });

    // polymorphic
    // get first post from editors
    store
      .queryRecord('post', { filter: { user: { type: 'editor' } } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: 10 most common mistakes'
        );
      });
    // regex
    store
      .queryRecord('post', { filter: { user: { type: /^ed(.*)ors$/ } } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: 10 most common mistakes'
        );
      });

    // get first post from editor '123'
    store
      .queryRecord('post', { filter: { user: { id: id, type: 'editor' } } })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: Testing with Ember PageObjects',
          'nuu'
        );
      });
    // regex
    store
      .queryRecord('post', {
        filter: { user: { id: id, type: /^ed(.*)ors$/ } },
      })
      .then(function (post) {
        assert.strictEqual(
          get(post, 'name'),
          'Ember.js: Testing with Ember PageObjects',
          'ups'
        );
        done();
      });
  });

  test('hasMany relationship', function (assert) {
    assert.expect(9);
    const done = assert.async();
    const store = this.owner.lookup('service:store');

    let anna, peter, moritz, project, bookPublication, cat, dog, dog2;

    run(function () {
      project = store.createRecord('project', {
        name: 'Componentize all the things!',
      });

      bookPublication = store.createRecord('book-publication', {
        name: 'Books For Dummies',
      });

      cat = store.createRecord('cat', { name: 'Cat name' });
      dog = store.createRecord('dog', { name: 'Dog name' });
      dog2 = store.createRecord('dog', { name: 'Dog name 2' });

      anna = store.createRecord('user', {
        name: 'Anna',
        pets: [cat],
      });
      anna.save();

      peter = store.createRecord('user', {
        name: 'Peter',
        pets: [dog2],
        projects: [project],
        bookPublications: [bookPublication],
      });
      peter.save();

      moritz = store.createRecord('user', {
        name: 'Moritz',
        pets: [cat, dog],
        projects: [project],
        bookPublications: [bookPublication],
      });
      moritz.save();

      project.save();
      cat.save();
      dog.save();
      dog2.save();
    });

    const id = get(project, 'id'),
      regexId = new RegExp('^' + id + '$');

    // get first user who've contributed to project.id = 123
    // string
    store
      .queryRecord('user', { filter: { projects: id } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Peter');
      });

    // object
    store
      .queryRecord('user', { filter: { projects: { id: id } } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Peter');
      });

    // regex
    store
      .queryRecord('user', { filter: { projects: regexId } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Peter');
      });

    // object regex
    store
      .queryRecord('user', { filter: { projects: { id: regexId } } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Peter');
      });

    // polymorphic
    // get first user with cats
    store
      .queryRecord('user', { filter: { pets: { type: 'cat' } } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Anna');
      });

    // get first user with cat '123'
    store
      .queryRecord('user', {
        filter: { pets: { id: get(cat, 'id'), type: 'cat' } },
      })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Anna');
      });

    // get first user with cats AND dogs
    store
      .queryRecord('user', {
        filter: { pets: [{ type: 'cat' }, { type: 'dog' }] },
      })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Moritz');
      });

    // get first user with cats OR dogs
    store
      .queryRecord('user', { filter: { pets: { type: /cats|dogs/ } } })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Anna');
      });

    // get the first user with bookPublication '123' (camelcased key)
    store
      .queryRecord('user', {
        filter: { bookPublications: get(bookPublication, 'id') },
      })
      .then(function (user) {
        assert.strictEqual(get(user, 'name'), 'Peter');
        done();
      });
  });
});
