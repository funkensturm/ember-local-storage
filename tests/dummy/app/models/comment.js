import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  post: belongsTo('post', { async: true, autoSave: true, inverse: 'comments' }),
});
