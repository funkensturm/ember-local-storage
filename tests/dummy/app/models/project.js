import Model, { attr, hasMany } from '@ember-data/model';

export default class extends Model {
  @attr('string') name;

  @hasMany('task', { async: true }) tasks;
  @hasMany('user', { async: true }) users;
}
