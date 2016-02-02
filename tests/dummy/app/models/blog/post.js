import DS from 'ember-data';

const {
  Model,
  attr,
  belongsTo,
  hasMany
} = DS;

export default Model.extend({
  name: attr('string'),

  user: belongsTo('user', { async: true, autoSave: true }),
  comments: hasMany('comment', { async: true, dependent: 'destroy' })
});
