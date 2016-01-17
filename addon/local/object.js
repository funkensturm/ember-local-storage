import Ember from 'ember';
import ObjectProxyMixin from '../mixins/object';

export default Ember.ObjectProxy.extend(ObjectProxyMixin, {
  _storageType: 'local'
});