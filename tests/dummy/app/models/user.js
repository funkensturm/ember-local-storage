import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  bookPublications: hasMany('book-publications', {
    async: true,
    inverse: 'users',
  }),
  projects: hasMany('project', {
    async: true,
    dependent: 'destroy',
    inverse: 'users',
  }),
  posts: hasMany('post', {
    async: true,
    dependent: 'destroy',
    inverse: 'user',
  }),
  pets: hasMany('pet', {
    async: true,
    dependent: 'destroy',
    inverse: 'users',
    polymorphic: true,
  }),
});
