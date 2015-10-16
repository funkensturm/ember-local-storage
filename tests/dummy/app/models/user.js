import DS from 'ember-data';

const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  name: attr('string'),

  posts: hasMany('post', { async: true, dependent: 'destroy' })
});