import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';
import { set } from '@ember/object';
import StorageProxyMixin from './storage';
import { save } from '../helpers/utils';

export default Mixin.create(StorageProxyMixin, {
  _initialContent: A(),
  _clear() {
    set(this, 'content', A());
  },

  replaceContent: save,
  reset: save,
});
