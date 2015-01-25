import Ember from 'ember';
import LocalStorageProxyMixin from './mixin';

export default Ember.ArrayProxy.extend(LocalStorageProxyMixin, {
  initialContent: [],

  replaceContent: function(idx, amount, objects) {
    this._super(idx, amount, objects);
    this.save();
  }
});