import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  user: belongsTo('user', { async: true, autoSave: true }),
  comments: hasMany('comment', { async: true, dependent: 'destroy' }),
});
