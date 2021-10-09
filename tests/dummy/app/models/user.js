import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;

  @hasMany('book-publications', { async: true }) bookPublications;
  @hasMany('project', { async: true }) projects;
  @hasMany('post', { async: true, dependent: 'destroy' }) posts;
  @hasMany('pet', { async: true, polymorphic: true, dependent: 'destroy' }) pets;
}
