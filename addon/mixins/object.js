import Ember from 'ember';
import StorageProxyMixin from './storage';

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: {},

  setUnknownProperty: function(key) {
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
  }
});
