import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  commentCount: attr('number'),
  isPrivate: attr('boolean', { defaultValue: true }),

  user: belongsTo('user', {
    async: true,
    autoSave: true,
    inverse: 'posts',
    polymorphic: true,
  }),
  comments: hasMany('comment', {
    async: true,
    dependent: 'destroy',
    inverse: 'post',
  }),
});
