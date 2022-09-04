import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  position: attr('number'),

  project: belongsTo('project', {
    async: true,
    autoSave: true,
  }),

  parent: belongsTo('task', {
    async: true,
    autoSave: true,
    inverse: 'children',
  }),

  children: hasMany('task', {
    async: true,
    dependent: 'destroy',
    inverse: 'parent',
  }),
});
