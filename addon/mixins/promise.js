import Ember from 'ember';

export default Ember.Mixin.create({
  clear() {
    this.then((storage) => {
      storage.clear();
    });
  },
  reset() {
    this.then((storage) => {
      storage.reset();
    });
  }
});
