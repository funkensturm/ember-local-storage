import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @action createTask(name) {
    let task = this.store.createRecord('task', { name: name });

    // The project
    let project = this.model;
    project.tasks.addObject(task);

    task.project = project;
    task.save().then(() => {
      this.name = null;
    });
  }

  @action deleteTask(task) {
    task.destroyRecord();
  }
}
