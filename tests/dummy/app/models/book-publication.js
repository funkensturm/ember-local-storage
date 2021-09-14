import Model, { attr, hasMany } from '@ember-data/model';

export default class BookPublicationModel extends Model {
  @attr('string') name;

  @hasMany('user', { async: true }) user;
}
