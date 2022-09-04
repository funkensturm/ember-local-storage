import Mixin from '@ember/object/mixin';
import { set, get } from '@ember/object';
import { isArray, A } from '@ember/array';
import { getStorage } from '../helpers/storage';
import { copy } from 'ember-copy';

export default Mixin.create({
  _storageKey: null,
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
    const storageKey = get(this, '_storageKey');
    const initialContent = get(this, '_initialContent');

    let serialized, content;

    set(this, '_initialContentString', JSON.stringify(initialContent));

    // Merge the serialized version into defaults.
    content = this._getInitialContentCopy();

    // Retrieve the serialized version from storage.
    serialized = storage[storageKey];
    if (serialized) {
      Object.assign(content, JSON.parse(serialized));
    }

    // Do not change to set(this, 'content', content)
    this.set('content', content);

    // Keep in sync with other windows
    this._addStorageListener();

    return this._super(...arguments);
  },

  _getInitialContentCopy() {
    const initialContent = get(this, '_initialContent');
    const content = copy(initialContent, true);

    // copy returns a normal array when prototype extensions are off
    // This ensures that we wrap it in an Ember Array.
    return isArray(content) ? A(content) : content;
  },

  _addStorageListener() {
    const storage = this._storage();
    const storageKey = get(this, '_storageKey');

    if (window.addEventListener) {
      this._storageEventHandler = (event) => {
        if (this.isDestroying) {
          return;
        }

        if (event.storageArea === storage && event.key === storageKey) {
          if (
            ('hidden' in document && !document.hidden && !this._testing) ||
            event.newValue === event.oldValue ||
            event.newValue === JSON.stringify(this.get('content'))
          ) {
            return;
          }

          if (event.newValue) {
            // TODO: Why do we use this.set here? I guess it's the loop bug...
            this.set('content', JSON.parse(event.newValue));
          } else {
            this.clear();
          }
        }
      };

      window.addEventListener('storage', this._storageEventHandler, false);
    }
  },

  _save() {
    const storage = this._storage();
    const content = get(this, 'content');
    const storageKey = get(this, '_storageKey');
    const initialContentString = get(this, '_initialContentString');

    // TODO: Why is it needed?
    if (storageKey) {
      let json = JSON.stringify(content);

      if (json !== initialContentString) {
        set(this, '_isInitialContent', false);
      }

      storage[storageKey] = json;
    }
  },

  willDestroy() {
    if (this._storageEventHandler) {
      window.removeEventListener('storage', this._storageEventHandler, false);
    }

    this._super(...arguments);
  },

  // Public API

  // returns boolean
  isInitialContent() {
    return get(this, '_isInitialContent');
  },

  // reset the content
  // returns void
  reset() {
    const content = this._getInitialContentCopy();

    // Do not change to set(this, 'content', content)
    this.set('content', content);
    set(this, '_isInitialContent', true);
  },

  // clear the content
  // returns void
  clear() {
    this._clear();
    delete this._storage()[get(this, '_storageKey')];
  },
});
