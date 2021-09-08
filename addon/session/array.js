import ArrayProxy from '@ember/array/proxy';
import ArrayProxyMixin from '../mixins/array';

export default ArrayProxy.extend(ArrayProxyMixin, {
  _storageType: 'session',
});
