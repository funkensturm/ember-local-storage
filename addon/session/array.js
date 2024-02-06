import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import { set } from '@ember/object';
import StorageProxyMixin from 'ember-local-storage/-private/legacy-mixins/storage';
import { save } from 'ember-local-storage/-private/legacy-utils';

export default ArrayProxy.extend(StorageProxyMixin, {
  _initialContent: A(),
  _storageType: 'session',

  _clear() {
    set(this, 'content', A());
  },

  replaceContent: save,
  reset: save,
});
