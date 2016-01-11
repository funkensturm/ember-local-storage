import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  _initialContent: {},

  // TODO remove on 1.0 release i guess it's not a breaking change but i'm not sure
  setUnknownProperty: function(key) {
    this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this.save();
    }
  },

  set: function(key) {
    this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this.save();
    }
  },

  setProperties: function() {
    this._super.apply(this, arguments);
    this.save();
  },

  _clear: function() {
    set(this, 'content', {});
  }
});
