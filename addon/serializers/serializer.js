import DS from 'ember-data';

const {
  JSONAPISerializer
} = DS;

export default JSONAPISerializer.extend({
  // Serialization behavior
  _shouldSerializeHasMany: function() { return true; },
  shouldSerializeHasMany: function() { return true; },
  // Ensure that returned data is null if undefined
  normalizeResponse() {
    const result = this._super(...arguments);
    if (result.data === undefined) {
      result.data = null;
    }
    return result;
  }
});
