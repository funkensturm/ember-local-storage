import { assign, merge } from '@ember/polyfills';
import { assert } from '@ember/debug';
import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { dasherize } from '@ember/string';
import { deprecate } from '@ember/application/deprecations';

const assign = assign || merge;

const storage = {};

function tryStorage(name) {
  let nativeStorage;

  // safari private mode exposes xStorage but fails on setItem
  try {
    nativeStorage = (name === 'local') ? localStorage : sessionStorage;
    nativeStorage.setItem('emberlocalstorage.test', 'ok');
    nativeStorage.removeItem('emberlocalstorage.test');
  } catch (e) {
    nativeStorage = undefined;
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

// TODO: v2.0 - Remove options
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
// TODO: v2.0 - Remove options and legacyKey
function createStorage(context, key, modelKey, options) {
  const owner = getOwner(context);
  const factoryType = 'storage';
  const storageFactory = `${factoryType}:${key}`;

  let storageKey;

  owner.registerOptionsForType(factoryType, { instantiate: false });

  if (options.legacyKey) {
    deprecate('Using legacyKey has been deprecated and will be removed in version 2.0.0', false, {
      id: 'ember-local-storage.storageFor.options.legacyKey',
      until: '2.0.0',
      url: 'https://github.com/funkensturm/ember-local-storage#deprecations'
    });

    storageKey = options.legacyKey;
  } else {
    storageKey = modelKey ? `${storageFactory}:${modelKey}` : storageFactory;
  }

  storageKey = _buildKey(context, storageKey);

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

  return EmberObject.create(StorageFactory);
}

function _modelKey(model) {
  const modelName = model.modelName || model.constructor.typeKey || model.constructor.modelName;
  const id = model.get('id');

  if (!modelName || !id) {
    throw new TypeError('The model must have a `modelName` and `id` on it');
  }

  return `${modelName}:${id}`;
}

// TODO: v2.0 - Make modulePrefix the default
function _getNamespace(appConfig, addonConfig) {
  // For backward compatibility this is a opt-in feature
  let namespace = addonConfig.namespace;

  // Shortcut for modulePrefix
  if (namespace === true) {
    namespace = appConfig.modulePrefix
  }

  return namespace;
}

// TODO: Add migration helper
function _buildKey(context, key) {
  let appConfig = getOwner(context).resolveRegistration('config:environment');
  let addonConfig = appConfig && appConfig['ember-local-storage'] || {};
  let namespace = _getNamespace(appConfig, addonConfig);
  let delimiter = addonConfig.keyDelimiter || ':';

  return namespace ? `${namespace}${delimiter}${key}` : key;
}

// Testing helper
function _resetStorages() {
  storages = {};
}

export {
  tryStorage,
  getStorage,
  storageFor,
  _resetStorages,
  _buildKey
};
