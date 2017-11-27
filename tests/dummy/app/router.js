import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
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
