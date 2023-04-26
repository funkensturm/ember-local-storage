import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  users: hasMany('user', {
    async: true,
    inverse: 'projects',
    polymorphic: true,
  }),
  tasks: hasMany('task', { async: true, inverse: 'project' }),
});
