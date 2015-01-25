import Ember from 'ember';
import LocalStorageProxyMixin from './mixin';

export default Ember.ObjectProxy.extend(LocalStorageProxyMixin, {
  initialContent: {},

  setUnknownProperty: function (key, value) {
    this._super(key, value);
    this.save();
  },

  set: function(keyName, value) {
    this._super(keyName, value);
    this.save();
  }
});