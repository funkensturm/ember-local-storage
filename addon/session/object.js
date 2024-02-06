import { set } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import StorageProxyMixin from 'ember-local-storage/-private/legacy-mixins/storage';
import { save, saveIfChanged } from 'ember-local-storage/-private/legacy-utils';

export default ObjectProxy.extend(StorageProxyMixin, {
  _initialContent: {},
  _storageType: 'session',

  _clear() {
    set(this, 'content', {});
  },

  setUnknownProperty: saveIfChanged,
  set: saveIfChanged,
  setProperties: save,
});
