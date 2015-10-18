import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model: function() {
    return this.store.findAll('post');
  },

  readFile: function(file) {
    const reader = new FileReader();

    return new Ember.RSVP.Promise((resolve) => {
      reader.onload = function(event) {
        resolve({
          file: file.name,
          type: file.type,
          data: event.target.result,
          size: file.size
        });
      };

      reader.readAsText(file);
    });
  },

  actions: {
    createPost: function() {
      const user = this.store.createRecord('user', { name: 'User' }),
        post = this.store.createRecord('post', {
          name: 'Test Post',
          user: user
        });

      post.save();
    },
    deletePost: function(post) {
      post.destroyRecord();
      this.transitionTo('posts');
    },
    importData: function(event) {
      this.readFile(event.target.files[0])
        .then((file) => {
          this.store
            .importData(file.data)
            .then(function() {
              // show a flash message or transitionTo somewehere
            });
        });
    },
    exportData: function() {
      this.store.exportData(
        ['posts', 'comments'],
        {download: true, filename: 'my-data.json'}
      ).then(function() {
        // show a flash message or transitionTo somewehere
      });
    }
  }
});