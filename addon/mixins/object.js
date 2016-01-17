import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  _initialContent: {},

  setUnknownProperty: function(key) {
    this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this._save();
    }
  },

  set: function(key) {
    this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this._save();
    }
  },

  setProperties: function() {
    this._super.apply(this, arguments);
    this._save();
  },

  _clear: function() {
    set(this, 'content', {});
  }
});
