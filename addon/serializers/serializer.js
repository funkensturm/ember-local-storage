import DS from 'ember-data';

const {
  JSONAPISerializer
} = DS;

// TODO const Serializer = JSONAPISerializer || RESTSerializer;
const Serializer = JSONAPISerializer;

export default Serializer.extend({
  // Serialization behavior
  _shouldSerializeHasMany: function() { return true; }
});
