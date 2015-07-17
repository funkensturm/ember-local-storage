import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: {},

  // TODO remove on 1.0 release i guess it's not a breaking change but i'm not sure
  setUnknownProperty: function(key, value) {
    return this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this.save();
    }
  },

  set: function(key) {
    return this._super.apply(this, arguments);

    if (key !== '_isInitialContent') {
      this.save();
    }
  },

  setProperties: function(props) {
    return this._super.apply(this, arguments);
    this.save();
  },

  _clear: function() {
    set(this, 'content', {});
  }
});
