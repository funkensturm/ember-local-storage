import { get } from '@ember/object';
import BaseAdapter from './base';
import { getStorage, _buildKey } from 'ember-local-storage/helpers/storage';
import StorageArray from 'ember-local-storage/session/array';
import { getOwner } from '@ember/application';

export default class SessionStorageAdapter extends BaseAdapter {
  _storage = getStorage('session');

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
