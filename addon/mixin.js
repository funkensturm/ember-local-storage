import Ember from 'ember';

export default Ember.Mixin.create({
  localStorageKey: null,
  initialContent: null,

  init: function() {
    var localStorageKey = this.get('localStorageKey'),
      initialContent = this.get('initialContent'),
      serialized,
      content;

    if (!localStorageKey) {
      throw new Error("You must specify which property name should be used to save " + this + " in localStorage by setting its localStorageKey property.");
    }

    if (!initialContent) {
      throw new Error("You must specify the initialContent.");
    }

    // Retrieve the serialized version from localStorage using the specified
    // key.
    serialized = localStorage[localStorageKey];

    // Merge the serialized version into defaults.
    content = initialContent;
    if (serialized) {
      content = Ember.merge(content, JSON.parse(serialized));
    }

    this.set('content', content);

    return this._super.apply(this, arguments);
  },

  save: function() {
    var content = this.get('content'),
      localStorageKey = this.get('localStorageKey');

    localStorage[localStorageKey] = JSON.stringify(content);
  }
});
