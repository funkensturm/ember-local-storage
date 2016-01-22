import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

const {
  assert,
  computed,
  merge,
  String: {
    dasherize
  }
} = Ember;


const storage = {};

function tryStorage(name) {
  let nativeStorage;

  // safari private mode exposes xStorage but fails on setItem
  try {
    nativeStorage = (name === 'local') ? localStorage : sessionStorage;
    nativeStorage.setItem('emberlocalstorage.test', 'ok');
    nativeStorage.removeItem('emberlocalstorage.test');
  } catch (e) {
    nativeStorage = null;
  }

  return nativeStorage;
}

function getStorage(name) {
  if (storage[name]) {
    return storage[name];
  } else {
    return storage[name] = tryStorage(name) || {};
  }
}

let storages = {};

function storageFor(key, modelName, options = {}) {
  if (arguments.length === 2 && typeof modelName === 'object') {
    options = modelName;
    modelName = null;
  }

  assert('The options argument must be an object', typeof options === 'object');

  // normalize key
  key = dasherize(key);

  if (!modelName) {
    return computed(function() {
      if (!storages[key]) {
        storages[key] = createStorage(this, key, null, options);
      }

      return storages[key];
    });
  }

  assert('The second argument must be a string', typeof modelName === 'string');

  return computed(modelName, function() {
    const model = this.get(modelName);

    // if the propertyValue is null/undefined we simply return null/undefined
    if (!model || typeof model === 'undefined') {
      return model;
    }

    const modelKey = _modelKey(model);
    // TODO allow callbacks to delete the storage if model gets deleted

    if (!storages[modelKey]) {
      storages[modelKey] = createStorage(this, key, modelKey, options);
    }

    return storages[modelKey];
  });
}

/*
 * Looks up the storage factory on the container and sets initial state
 * on the instance if desired.
 */
function createStorage(context, key, modelKey, options) {
  const owner = getOwner(context);
  const factoryType = 'storage';
  const storageFactory = `${factoryType}:${key}`;

  let storageKey;

  owner.registerOptionsForType(factoryType, { instantiate: false });

  if (options.legacyKey) {
    storageKey = options.legacyKey;
  } else {
    storageKey = modelKey ? `${storageFactory}:${modelKey}` : storageFactory;
  }

  const initialState = {},
    defaultState = {
      _storageKey: storageKey
    },
    StorageFactory = owner.lookup(storageFactory);

  if (!StorageFactory) {
    throw new TypeError(`Unknown StorageFactory: ${storageFactory}`);
  }

  if (typeof(StorageFactory.initialState) === 'function') {
    initialState._initialContent = StorageFactory.initialState.call(context);
  } else if (StorageFactory.initialState) {
    throw new TypeError('initialState property must be a function');
  }

  merge(initialState, defaultState);

  if (StorageFactory.create) {
    return StorageFactory.create(initialState);
  }

  return Ember.Object.create(StorageFactory);
}

function _modelKey(model) {
  const modelName = model.modelName || model.constructor.typeKey,
    id = model.get('id');

  if (!modelName || !id) {
    throw new TypeError('The model must have a `modelName` and `id` on it');
  }

  return `${modelName}:${id}`;
}

// Testing helper
function _resetStorages() {
  storages = {};
}

export {
  tryStorage,
  getStorage,
  storageFor,
  _resetStorages
};
