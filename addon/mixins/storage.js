import Ember from 'ember';

var storage = {};

function getStorage(name) {
  var nativeStorage = {};

  if (storage[name]) { return storage[name]; }

  try {
    nativeStorage = (name === 'local') ? localStorage : sessionStorage;
  } catch (e) {
    nativeStorage = {};
  }

  return storage[name] = nativeStorage;
}

export default Ember.Mixin.create({
  storageKey: null,
  initialContent: null,

  init: function() {
    var storage = this.storage(),
      storageKey = this.get('storageKey'),
      initialContent = this.get('initialContent'),
      serialized,
      content;

    if (this.get('localStorageKey')) {
      storageKey = this.get('localStorageKey');
      Ember.deprecate('Usage of localStorageKey is deprecated use storageKey instead.');
    }

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
    content = Ember.copy(initialContent, true);
    if (serialized) {
      Ember.merge(content, JSON.parse(serialized));
    }

    this.set('content', content);

    return this._super.apply(this, arguments);
  },

  save: function() {
    var storage = this.storage(),
      content = this.get('content'),
      storageKey = this.get('storageKey');

    if (storageKey) {
      storage[storageKey] = JSON.stringify(content);
    }
  },

  storage: function() {
    return getStorage(this.get('_storage'));
  }
});
