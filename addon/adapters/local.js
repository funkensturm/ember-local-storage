import Ember from 'ember';
import BaseAdapter from './base';
import { getStorage, _buildKey } from '../helpers/storage';
import StorageArray from '../local/array';

const {
  get
} = Ember;

export default BaseAdapter.extend({
  _storage: getStorage('local'),

  _getIndex(type) {
    const indices = get(this, '_indices');

    if (!indices[type]) {
      let storageKey = _buildKey(this, 'index-' + type);

      indices[type] = StorageArray
        .extend({ _storageKey: storageKey })
        .create();
    }

    return indices[type];
  }
});
