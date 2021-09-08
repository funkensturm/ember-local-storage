import Mixin from '@ember/object/mixin';
import { set } from '@ember/object';
import StorageProxyMixin from './storage';
import { save, saveIfChanged } from '../helpers/utils';

export default Mixin.create(StorageProxyMixin, {
  _initialContent: {},
  _clear() {
    set(this, 'content', {});
  },

  setUnknownProperty: saveIfChanged,
  set: saveIfChanged,
  setProperties: save,
});
