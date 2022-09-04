import ObjectProxy from '@ember/object/proxy';
import ObjectProxyMixin from '../mixins/object';

export default ObjectProxy.extend(ObjectProxyMixin, {
  _storageType: 'local',
});
