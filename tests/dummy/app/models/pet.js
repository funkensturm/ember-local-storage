import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  users: hasMany('user', {
    async: true,
    inverse: 'pets',
    polymorphic: true,
  }),
});
