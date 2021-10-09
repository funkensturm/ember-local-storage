import BaseAdapter from './base';
import { getStorage, _buildKey } from '../helpers/storage';
import StorageArray from '../local/array';

export default class LocalAdapter extends BaseAdapter {
  constructor() {
    super(...arguments);
    this._storage = getStorage('local');
  }

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
