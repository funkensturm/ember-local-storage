import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TaskModel extends Model {
  @attr('string') name;
  @attr('number') position;

  @belongsTo('project', {
    async: true,
    autoSave: true
  })
  project;

  @belongsTo('task', {
    async: true,
    autoSave: true,
    inverse: 'children'
  })
  parent;

  @hasMany('task', {
    async: true,
    dependent: 'destroy',
    inverse: 'parent'
  })
  children;
}
