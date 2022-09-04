import { get } from '@ember/object';
import BaseAdapter from './base';
import { getStorage, _buildKey } from '../helpers/storage';
import StorageArray from '../local/array';
import { getOwner } from '@ember/application';

export default class LocalStorageAdapter extends BaseAdapter {
  _storage = getStorage('local');

  _getIndex(type) {
    const indices = get(this, '_indices');

    if (!indices[type]) {
      let storageKey = _buildKey(this, 'index-' + type);
      let owner = getOwner(this);
      indices[type] = StorageArray.extend({ _storageKey: storageKey }).create(
        owner.ownerInjection()
      );
    }

    return indices[type];
  }
}
