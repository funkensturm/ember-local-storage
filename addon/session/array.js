import Ember from 'ember';
import ArrayProxyMixin from '../mixins/array';

export default Ember.ArrayProxy.extend(ArrayProxyMixin, {
  _storageType: 'session'
});