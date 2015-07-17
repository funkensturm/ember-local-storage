import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

const storage = {};

function getStorage(name) {
  var nativeStorage = {};

  if (storage[name]) { return storage[name]; }

  // safari private mode exposes xStorage but fails on setItem
  try {
    nativeStorage = (name === 'local') ? localStorage : sessionStorage;
    nativeStorage.setItem('emberlocalstorage.test', 'ok');
    nativeStorage.removeItem('emberlocalstorage.test');
  } catch (e) {
    nativeStorage = {};
  }

  return storage[name] = nativeStorage;
}

export default Ember.Mixin.create({
  storageKey: null,
  initialContent: null,
  _initialContentString: null,
  _isInitialContent: true,

  init: function() {
    const storage = this.storage(),
      initialContent = get(this, 'initialContent');

    let serialized, content,
      storageKey = get(this, 'storageKey');

    // TODO remove on 1.0 release and make storageKey a const
    if (get(this, 'localStorageKey')) {
      storageKey = get(this, 'localStorageKey');
      Ember.deprecate('Usage of localStorageKey is deprecated use storageKey instead.');
    }

    if (!storageKey) {
      throw new Error('You must specify which property name should be used to save ' + this + ' in ' + get(this, '_storage') + 'Storage by setting its storageKey property.');
    }

    if (!initialContent) {
      throw new Error('You must specify the initialContent.');
    }

    set(this, '_initialContentString', JSON.stringify(initialContent));

    // Retrieve the serialized version from storage using the specified
    // key.
    serialized = storage[storageKey];

    // Merge the serialized version into defaults.
    content = this._getInitialContentCopy();

    if (serialized) {
      Ember.merge(content, JSON.parse(serialized));
    }

    // Do not change to set(this, 'content', content)
    this.set('content', content);

    return this._super.apply(this, arguments);
  },

  save: function() {
    const storage = this.storage(),
      content = get(this, 'content'),
      storageKey = get(this, 'storageKey'),
      initialContentString = get(this, '_initialContentString');

    if (storageKey) {
      let json = JSON.stringify(content);

      if (json !== initialContentString) {
        set(this, '_isInitialContent', false);
      }

      storage[storageKey] = json;
    }
  },

  storage: function() {
    return getStorage(get(this, '_storage'));
  },

  _getInitialContentCopy: function() {
    const initialContent = get(this, 'initialContent'),
      content = Ember.copy(initialContent, true);

    // Ember.copy returns a normal array when prototype extensions are off
    // This ensures that we wrap it in an Ember Array.
    return Ember.isArray(content) ? Ember.A(content) : content;
  },

  isInitialContent: function() {
    return get(this, '_isInitialContent');
  },

  reset: function() {
    const content = this._getInitialContentCopy();

    // Do not change to set(this, 'content', content)
    this.set('content', content);
    set(this, '_isInitialContent', true);
  },

  clear: function() {
    this._clear();
    delete this.storage()[get(this, 'storageKey')];
  }
});
