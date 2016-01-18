import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('adapter', function() {
    this.route('projects', function() {
      this.route('project', { path: ':project_id' }, function() {
        this.route('tasks', function() {
          this.route('task', { path: ':task_id' });
        });
      });
    });
  });

  this.route('storage-for');
});

export default Router;
