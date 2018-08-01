import DS from 'ember-data';

const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  name: attr('string'),

  bookPublications: hasMany('book-publications', { async: true, inverse: 'user' }),
  projects: hasMany('project', { async: true, inverse: 'users' }),
  posts: hasMany('post', { async: true, dependent: 'destroy', inverse: 'user' }),
  pets: hasMany('pet', { async: true, polymorphic: true, dependent: 'destroy',  inverse: 'users' })
});
