import Ember from 'ember';

const {
  assert,
  computed,
  getOwner,
  String: {
    dasherize
  }
} = Ember;

const localforage = window.localforage;
const sessionStorageWrapper = window.sessionStorageWrapper;

const assign = Ember.assign || Ember.merge;

const drivers = {
  'session': sessionStorageWrapper._driver,
  'local': localforage.LOCALSTORAGE,
  'websql': localforage.WEBSQL,
  'indexeddb': localforage.INDEXEDDB
};

const customDrivers = {
  'session': sessionStorageWrapper
};

const storage = {};

function tryStorage(name) {
  const driver = drivers[name];
  if (driver === undefined) {
    return undefined;
  }
  const setDriverAndTest = function (forageInstance, forageDriver) {
    forageInstance.setDriver(forageDriver);
    forageInstance.setItem('emberlocalstorage.test', 'ok').then(() => {
      return forageInstance.removeItem('emberlocalstorage.test');
    })
  }
  try {
    const forage = localforage.createInstance();
    if (customDrivers[name]) {
      forage.defineDriver(customDrivers[name]).then(() => {
        setDriverAndTest(forage, driver);
      })
    } else {
      setDriverAndTest(forage, driver);
    }
    return forage;
  } catch (e) {
    return undefined;
  }
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
    const storageKey = `${key}:${modelKey}`;
    // TODO allow callbacks to delete the storage if model gets deleted

    if (!storages[storageKey]) {
      storages[storageKey] = createStorage(this, key, modelKey, options);
    }

    return storages[storageKey];
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

  assign(initialState, defaultState);

  if (StorageFactory.create) {
    return StorageFactory.create(initialState);
  }

  return Ember.Object.create(StorageFactory);
}

function _modelKey(model) {
  const modelName = model.modelName || model.constructor.typeKey || model.constructor.modelName;
  const id = model.get('id');

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
