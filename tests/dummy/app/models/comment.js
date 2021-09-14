import Model, { attr, belongsTo } from '@ember-data/model';

export default class BlogPostModel extends Model {
  @attr('string') name;

  @belongsTo('post', { async: true, autoSave: true }) post;
}