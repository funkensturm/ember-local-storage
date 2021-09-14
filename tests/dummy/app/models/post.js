import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') name;
  @attr('number') commentCount;
  @attr('boolean', { defaultValue: true }) isPrivate;

  @belongsTo('user', { async: true, autoSave: true }) user;
  @hasMany('comment', { async: true, dependent: 'destroy' }) comments;
}
