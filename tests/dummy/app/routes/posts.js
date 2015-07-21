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
      const post = this.store.createRecord('post', {
        name: 'Test Post'
      });

      post.save();
    },
    deletePost: function(post) {
      post.destroyRecord();
      this.transitionTo('posts');
    },
    import: function(event) {
      this.readFile(event.target.files[0])
        .then((file) => {
          const types = ['post', 'comment'];
          types.forEach((type) => {
            this.store.unloadAll(type);
          });
          // TODO fix we need a type to get the right adapter
          this.store.importData(file.data);
          types.forEach((type) => {
            this.store.findAll(type);
          });
        });
    },
    export: function() {
      const json = this.store.exportData(
        ['posts', 'comments'],
        {download: true, filename: 'my-data.json'}
      );
    }
  }
});