import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  tasks: hasMany('task', { async: true }),
  users: hasMany('user', { async: true }),
});
