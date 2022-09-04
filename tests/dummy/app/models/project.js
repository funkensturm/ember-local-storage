import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  tasks: hasMany('task', { async: true }),
  users: hasMany('user', { async: true }),
});
