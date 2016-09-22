import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('adapter', function() {
    this.route('projects', { resetNamespace: true }, function() {
      this.route('project', { path: ':project_id' }, function() {
        this.route('tasks', { resetNamespace: true }, function() {
          this.route('task', { path: ':task_id' });
        });
      });
    });
  });

  this.route('storage-for');
});

export default Router;
