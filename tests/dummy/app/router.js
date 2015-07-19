import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('posts', function() {
    this.route('post', {path: ':post_id', resetNamespace: true});
  });
  this.route('settings');
});

export default Router;
