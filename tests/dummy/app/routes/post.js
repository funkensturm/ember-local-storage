import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model: function(params) {
    return this.store.findRecord('post', params.post_id);
  },

  actions: {
    createComment: function(model) {
      const comment = this.store.createRecord('comment', {
        name: 'Test comment',
        post: model
      });

      comment.save();
    },
    deleteComment: function(comment) {
      comment.destroyRecord();
    }
  }
});

