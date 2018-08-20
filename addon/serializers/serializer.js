import DS from 'ember-data';

const {
  JSONAPISerializer
} = DS;

export default JSONAPISerializer.extend({
  // Serialization behavior
  // Can be removed (_shouldSerializeHasMany) removed in ember data 3.0.0
  // https://github.com/emberjs/data/pull/5290
  _shouldSerializeHasMany: function() { return true; },
  shouldSerializeHasMany: function() { return true; },

  serializeBelongsTo(snapshot, json, relationship) {
    if (DS.VERSION.match(/^3\.[1-5]\./)) {
      this._fixSerializeBelongsTo(snapshot, json, relationship);
    } else {
      this._super.apply(this, arguments);
    }
  },

  serializeHasMany(snapshot, json, relationship) {
    if (DS.VERSION.match(/^3\.[1-5]\./)) {
      this._fixSerializeHasMany(snapshot, json, relationship);
    } else {
      this._super.apply(this, arguments);
    }
  },

  _fixSerializeBelongsTo(snapshot, json, relationship) {
    let key = relationship.key;

    if (this._canSerialize(key)) {
      let belongsTo = snapshot.belongsTo(key);
      let belongsToIsNotNew = belongsTo && belongsTo.record && belongsTo.record.get('id');

      if (belongsTo === null || belongsToIsNotNew) {
        json.relationships = json.relationships || {};

        let payloadKey = this._getMappedKey(key, snapshot.type);
        if (payloadKey === key) {
          payloadKey = this.keyForRelationship(key, 'belongsTo', 'serialize');
        }

        let data = null;
        if (belongsTo) {
          let payloadType = this.payloadKeyFromModelName(belongsTo.modelName);

          data = {
            type: payloadType,
            id: belongsTo.id,
          };
        }

        json.relationships[payloadKey] = { data };
      }
    }
  },

  _fixSerializeHasMany(snapshot, json, relationship) {
    let key = relationship.key;

    if (this.shouldSerializeHasMany(snapshot, key, relationship)) {
      let hasMany = snapshot.hasMany(key);
      if (hasMany !== undefined) {
        json.relationships = json.relationships || {};

        let payloadKey = this._getMappedKey(key, snapshot.type);
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
        }

        // only serialize has many relationships that are not new
        let nonNewHasMany = hasMany.filter(item => item.record && item.record.get('id'));
        let data = new Array(nonNewHasMany.length);

        for (let i = 0; i < nonNewHasMany.length; i++) {
          let item = hasMany[i];
          let payloadType = this.payloadKeyFromModelName(item.modelName);

          data[i] = {
            type: payloadType,
            id: item.id,
          };
        }

        json.relationships[payloadKey] = { data };
      }
    }
  },
});
