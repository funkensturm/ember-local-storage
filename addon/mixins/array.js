import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  _initialContent: Ember.A(),

  replaceContent: function() {
    this._super.apply(this, arguments);
    this._save();
  },

  // we need to save
  reset: function() {
    this._super.apply(this, arguments);
    this._save();
  },

  _clear: function() {
    set(this, 'content', Ember.A());
  }
});
