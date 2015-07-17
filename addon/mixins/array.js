import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: Ember.A(),

  replaceContent: function() {
    this._super.apply(this, arguments);
    this.save();
  },

  // we need to save
  reset: function() {
    this._super.apply(this, arguments);
    this.save();
  },

  _clear: function() {
    set(this, 'content', Ember.A());
  }
});
