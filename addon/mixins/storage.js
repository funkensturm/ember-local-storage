import Ember from 'ember';

// It only prevents the browser to throw an error
// TODO implement polyfill: https://gist.github.com/remy/350433
// if (typeof window.localStorage === 'undefined') {
//   localStorage = {};
// }
//
// if (typeof window.sessionStorage === 'undefined') {
//   sessionStorage = {};
// }

export default Ember.Mixin.create({
  storageKey: null,
  initialContent: null,

  init: function() {
    var storage = this.storage(),
      storageKey = this.get('storageKey'),
      initialContent = this.get('initialContent'),
      serialized,
      content;

    if (!storageKey) {
      throw new Error('You must specify which property name should be used to save ' + this + ' in ' + this.get('_storage') + 'Storage by setting its storageKey property.');
    }

    if (!initialContent) {
      throw new Error('You must specify the initialContent.');
    }

    // Retrieve the serialized version from storage using the specified
    // key.
    serialized = storage[storageKey];

    // Merge the serialized version into defaults.
    content = initialContent;
    if (serialized) {
      content = Ember.merge(content, JSON.parse(serialized));
    }

    this.set('content', content);

    return this._super.apply(this, arguments);
  },

  save: function() {
    var storage = this.storage(),
      content = this.get('content'),
      storageKey = this.get('storageKey');

    storage[storageKey] = JSON.stringify(content);
  },

  storage: function() {
    return (this.get('_storage') === 'local') ? localStorage : sessionStorage;
  }
});
