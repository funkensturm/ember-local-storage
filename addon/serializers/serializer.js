import DS from 'ember-data';

const {
  JSONAPISerializer
} = DS;

export default JSONAPISerializer.extend({
  // Serialization behavior
  _shouldSerializeHasMany: function() { return true; }
});
