import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTask(name) {
      let task = this.store.createRecord('task', { name: name });

      // The project
      let project = this.get('model');
      project.get('tasks').addObject(task);

      task.set('project', project);
      task.save()
        .then(() => {
          this.set('name', null);
        });
    },

    deleteTask(task) {
      task.destroyRecord();
    }
  }
});