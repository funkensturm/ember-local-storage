import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @attr('string') name;

  @belongsTo('user', { async: true, autoSave: true }) user;
  @hasMany('comment', { async: true, dependent: 'destroy' }) comments;
}
