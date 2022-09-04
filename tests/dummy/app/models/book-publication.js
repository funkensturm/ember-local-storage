import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),

  user: hasMany('user', { async: true }),
});
