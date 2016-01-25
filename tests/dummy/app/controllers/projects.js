import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

function readFile(file) {
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
}

export default Ember.Controller.extend({
  settings: storageFor('settings'),

  actions: {
    createProject(name) {
      let project = this.store.createRecord('project', { name: name });

      this.store
        .findRecord('user', this.get('settings.userId'))
        .then((user) => {
          user.get('projects').addObject(project);
          user.save();

          project.get('users').addObject(user);
          project.save()
            .then(() => {
              this.set('name', null);
            });
        });
    },

    deleteProject(project) {
      project.destroyRecord();
    },

    importData(event) {
      readFile(event.target.files[0])
        .then((file) => {
          this.store
            .importData(file.data)
            .then(function() {
              // show a flash message or transitionTo somewehere
            });
        });
    },

    exportData() {
      this.store.exportData(
        ['projects', 'tasks'],
        {download: true, filename: 'my-data.json'}
      ).then(function() {
        // show a flash message or transitionTo somewehere
      });
    }
  }
});