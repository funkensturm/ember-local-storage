import DS from 'ember-data';

const {
  Model,
  attr,
  belongsTo
} = DS;

export default Model.extend({
  name: attr('string'),

  post: belongsTo('post', { async: true, autoSave: true })
});