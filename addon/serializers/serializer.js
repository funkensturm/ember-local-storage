import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class Serializer extends JSONAPISerializer {
  shouldSerializeHasMany() {
    return true;
  }

  serializeBelongsTo() {
    this._fixSerializeBelongsTo(...arguments);
  }

  _fixSerializeBelongsTo(snapshot, json, relationship) {
    let key = relationship.key;

    if (this._canSerialize(key)) {
      let belongsTo = snapshot.belongsTo(key);
      let belongsToIsNotNew =
        belongsTo && belongsTo.record && belongsTo.record.get('id');

      if (belongsTo === null || belongsToIsNotNew) {
        json.relationships = json.relationships || {};

        let modelType = this.store.modelFor(snapshot.modelName);
        let payloadKey = this._getMappedKey(key, modelType);
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
  }

  serializeHasMany() {
    this._fixSerializeHasMany(...arguments);
  }

  _fixSerializeHasMany(snapshot, json, relationship) {
    let key = relationship.key;

    if (this.shouldSerializeHasMany(snapshot, key, relationship)) {
      let hasMany = snapshot.hasMany(key);
      if (hasMany !== undefined) {
        json.relationships = json.relationships || {};

        let modelType = this.store.modelFor(snapshot.modelName);
        let payloadKey = this._getMappedKey(key, modelType);
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
        }

        // only serialize has many relationships that are not new
        let nonNewHasMany = hasMany.filter(
          (item) => item.record && item.record.get('id')
        );
        let data = new Array(nonNewHasMany.length);

        for (let i = 0; i < nonNewHasMany.length; i++) {
          let item = nonNewHasMany[i];
          let payloadType = this.payloadKeyFromModelName(item.modelName);

          data[i] = {
            type: payloadType,
            id: item.id,
          };
        }

        json.relationships[payloadKey] = { data };
      }
    }
  }
}
