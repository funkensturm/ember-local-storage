import Ember from 'ember';
import StorageProxyMixin from './storage';

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: Ember.A(),

  replaceContent: function() {
    return this._super.apply(this, arguments);
    this.save();
  }
});
