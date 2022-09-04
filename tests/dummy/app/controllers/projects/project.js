import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  @service store;

  @tracked name = '';

  @action
  createTask(name) {
    let task = this.store.createRecord('task', { name: name });

    // The project
    let project = this.model;
    project.get('tasks').addObject(task);

    task.set('project', project);
    task.save().then(() => {
      this.name = '';
    });
  }

  @action
  deleteTask(task) {
    task.destroyRecord();
  }

  @action
  setName(event) {
    this.name = event.target.value;
  }
}
