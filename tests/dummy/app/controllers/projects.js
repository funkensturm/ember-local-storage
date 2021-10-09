import Controller from '@ember/controller';
import { Promise } from 'rsvp';
import { storageFor } from 'ember-local-storage';
import { action } from '@ember/object';

function readFile(file) {
  const reader = new FileReader();

  return new Promise((resolve) => {
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

export default class extends Controller {
  @storageFor('settings') settings;

  @action createProject(name) {
    let project = this.store.createRecord('project', { name });

      this.store
        .findRecord('user', this.settings.get('userId'))
        .then((user) => {
          user.projects.addObject(project);
          user.save();

        project.users.addObject(user);
        project.save()
          .then(() => {
            this.name = null;
          });
    });
  }

  @action deleteProject(project) {
    project.destroyRecord();
  }

  @action importData(event) {
    readFile(event.target.files[0]).then((file) => {
      this.store.importData(file.data).then(function () {
        // show a flash message or transitionTo somewehere
      });
    });
  }

  @action exportData() {
    this.store.exportData(['projects', 'tasks'], { download: true, filename: 'my-data.json' }).then(function () {
      // show a flash message or transitionTo somewehere
    });
  }
}
