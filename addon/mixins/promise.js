import Ember from 'ember';

export default Ember.Mixin.create({
  clear() {
    return this.then((storage) => {
      return storage.clear();
    });
  },
  reset() {
    return this.then((storage) => {
      return storage.reset();
    });
  }
});
