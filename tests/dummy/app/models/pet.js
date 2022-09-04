import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  users: hasMany('user', { async: true }),
});
