import { A } from '@ember/array';
import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend();

Storage.reopenClass({
  initialState() {
    return A(['1234']);
  }
});

export default Storage;