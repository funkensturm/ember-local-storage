import Ember from 'ember';
import StorageProxyMixin from './storage';

const set = Ember.set;

export default Ember.Mixin.create(StorageProxyMixin, {
  initialContent: Ember.A(),

  replaceContent: function(idx, amount, objects) {
    this._super(idx, amount, objects);
    this.save();
  },

  _clear: function() {
    set(this, 'content', Ember.A());
  }
});
