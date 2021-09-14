import BaseAdapter from './base';
import { getStorage, _buildKey } from '../helpers/storage';
import StorageArray from '../session/array';

export default class SessionAdapter extends BaseAdapter {
  @getStorage('session') _storage;

  _getIndex(type) {
    const indices = this._indices;

    if (!indices[type]) {
      let storageKey = _buildKey(this, 'index-' + type);

      indices[type] = StorageArray
        .extend({ _storageKey: storageKey })
        .create();
    }

    return indices[type];
  }
}
