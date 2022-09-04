import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { all, Promise } from 'rsvp';
import { storageFor } from 'ember-local-storage';

function readFile(file) {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = function (event) {
      resolve({
        file: file.name,
        type: file.type,
        data: event.target.result,
        size: file.size,
      });
    };

    reader.readAsText(file);
  });
}

export default class extends Controller {
  @service router;
  @service store;
  @storageFor('settings') settings;

  @tracked name = '';

  @action
  createProject(name) {
    let project = this.store.createRecord('project', { name: name });

    this.store.findRecord('user', this.settings.get('userId')).then((user) => {
      user.get('projects').addObject(project);
      user.save();

      project.get('users').addObject(user);
      project.save().then(() => {
        this.name = '';
      });
    });
  }

  @action
  deleteProject(project) {
    all(
      project.get('users').map((user) => {
        user.get('projects').removeObject(project);
        user.save();
      })
    ).then(() => {
      all(
        project.get('tasks').map((task) => {
          task.destroyRecord();
        })
      ).then(() => {
        project.destroyRecord().then(() => {
          this.router.transitionTo('projects');
        });
      });
    });
  }

  @action
  importData(event) {
    readFile(event.target.files[0]).then((file) => {
      this.store.importData(file.data).then(function () {
        // show a flash message or transitionTo somewehere
      });
    });
  }

  @action
  exportData() {
    this.store
      .exportData(['projects', 'tasks', 'users'], {
        download: true,
        filename: 'my-data.json',
      })
      .then(function () {
        // show a flash message or transitionTo somewehere
      });
  }

  @action
  setName(event) {
    this.name = event.target.value;
  }
}
