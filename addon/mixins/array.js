import Ember from 'ember';
import StorageProxyMixin from './storage';

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: [],

  replaceContent: function(idx, amount, objects) {
    this._super(idx, amount, objects);
    this.save();
  }
});