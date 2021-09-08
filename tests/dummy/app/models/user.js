import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  bookPublications: hasMany('book-publications', { async: true }),
  projects: hasMany('project', { async: true }),
  posts: hasMany('post', { async: true, dependent: 'destroy' }),
  pets: hasMany('pet', { async: true, polymorphic: true, dependent: 'destroy' }),
});
