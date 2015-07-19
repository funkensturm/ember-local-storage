import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model: function() {
    return this.store.findAll('post');
  },

  actions: {
    createPost: function() {
      const post = this.store.createRecord('post', {
        name: 'Test Post'
      });

      post.save();
    },
    deletePost: function(post) {
      post.destroyRecord();
      this.transitionTo('posts');
    }
  }
});