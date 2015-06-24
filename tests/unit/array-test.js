import Ember from 'ember';
import { module, test } from 'qunit';

import AnonymousLikes from 'dummy/models/anonymous-likes';

module('array - likes', {
  afterEach: function() {
    window.localStorage.clear();
  }
});

test('it does not share data', function(assert) {
  var imageLikes,
    postLikes;

  assert.expect(5);

  // ImageLikes
  imageLikes = AnonymousLikes.create({
    storageKey: 'image-likes',
  });

  assert.deepEqual(imageLikes.get('initialContent'), []);

  Ember.run(function() {
    imageLikes.addObject('martin');
  });

  assert.deepEqual(imageLikes.get('content'), ['martin']);


  // PostLikes
  postLikes = AnonymousLikes.create({
    storageKey: 'post-likes',
  });

  assert.deepEqual(postLikes.get('initialContent'), []);

  Ember.run(function() {
    postLikes.addObject('peter');
  });

  assert.deepEqual(postLikes.get('content'), ['peter']);

  // ImageLikes don't change
  assert.deepEqual(imageLikes.get('content'), ['martin']);
});
