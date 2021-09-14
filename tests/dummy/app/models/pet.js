import Model, { attr, hasMany } from '@ember-data/model';

export default class PetModel extends Model {
  @attr('string') name;

  @hasMany('user', { async: true }) users;
}
