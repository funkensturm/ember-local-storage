import Ember from 'ember';
import { getStorage } from '../helpers/storage';

const get = Ember.get;
const set = Ember.set;

const {
  Mixin,
  deprecate,
  copy,
  merge,
  isArray
} = Ember;

export default Mixin.create({
  // TODO remove on 2.0 release
  _storageKey: null,
  // TODO remove on 2.0 release
  initialContent: null,
  _initialContent: null,
  _initialContentString: null,
  _isInitialContent: true,
  // we need it for storage event testing
  _testing: false,

  // Shorthand for the storage
  _storage() {
    return getStorage(get(this, '_storageType'));
  },

  init() {
    const storage = this._storage();

    let serialized, content,
      storageKey = get(this, '_storageKey'),
      initialContent = get(this, '_initialContent');

    // TODO remove on 2.0 release and make storageKey a const
    if (get(this, 'storageKey')) {
      storageKey = get(this, 'storageKey');
      deprecate('Usage of storageKey is deprecated use the generator instead: ember g storage -h');
    }

    // TODO remove on 2.0 release and make initialContent a const
    if (get(this, 'initialContent')) {
      initialContent = get(this, 'initialContent');
      deprecate('Usage of initialContent is deprecated use the generator instead: ember g storage -h');
    }

    // TODO remove on 2.0 release
    if (!initialContent) {
      throw new Error('You must specify the initialContent.');
    }

    set(this, '_initialContentString', JSON.stringify(initialContent));

    // Retrieve the serialized version from storage..
    serialized = storage[storageKey];

    // Merge the serialized version into defaults.
    content = this._getInitialContentCopy();

    if (serialized) {
      merge(content, JSON.parse(serialized));
    }

    // Do not change to set(this, 'content', content)
    this.set('content', content);

    // Keep in sync with other windows
    this._addStorageListener();

    return this._super.apply(this, arguments);
  },

  _getInitialContentCopy() {
    const initialContent = get(this, '_initialContent'),
      content = copy(initialContent, true);

    // Ember.copy returns a normal array when prototype extensions are off
    // This ensures that we wrap it in an Ember Array.
    return isArray(content) ? Ember.A(content) : content;
  },

  _addStorageListener() {
    const storage = this._storage(),
      storageKey = get(this, '_storageKey');

    if (window.addEventListener) {
      window.addEventListener('storage', (event) => {
        if (event.storageArea === storage && event.key === storageKey) {
          if (
            ('hidden' in document && !document.hidden && !this._testing) ||
            event.newValue === event.oldValue ||
            event.newValue === JSON.stringify(this.get('content'))
          ) {
            return;
          }

          if (event.newValue) {
            this.set('content', JSON.parse(event.newValue));
          } else {
            this.clear();
          }
        }
      }, false);
    }
  },

  _save() {
    const storage = this._storage(),
      content = get(this, 'content'),
      storageKey = get(this, '_storageKey'),
      initialContentString = get(this, '_initialContentString');

    if (storageKey) {
      let json = JSON.stringify(content);

      if (json !== initialContentString) {
        set(this, '_isInitialContent', false);
      }

      storage[storageKey] = json;
    }
  },



  // Public API

  // returns boolean
  isInitialContent: function() {
    return get(this, '_isInitialContent');
  },

  // reset the content
  // returns void
  reset: function() {
    const content = this._getInitialContentCopy();

    // Do not change to set(this, 'content', content)
    this.set('content', content);
    set(this, '_isInitialContent', true);
  },

  // clear the content
  // returns void
  clear: function() {
    this._clear();
    delete this._storage()[get(this, '_storageKey')];
  }
});
