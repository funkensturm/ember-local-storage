import BaseAdapter from './base';
import { getStorage } from '../helpers/storage';

export default BaseAdapter.extend({
  _storage: getStorage('session')
});
