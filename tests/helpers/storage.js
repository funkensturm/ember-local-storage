function storageEqual(assert, actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  assert.equal(actual, expected, message);
}

function storageDeepEqual(assert, actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  assert.deepEqual(actual, expected, message);
}

function registerConfigEnvironment(context) {
  let environment = {
    modulePrefix: 'my-app',
    'ember-local-storage': {}
  };

  context.register('config:environment', environment, { instantiate: false });
}

function setConfigEnvironment(context, key, value) {
  let appConfig = context.container.lookup('config:environment');
  let addonConfig = appConfig['ember-local-storage'] || {};
  addonConfig[key] = value;
}

export {
  storageEqual,
  storageDeepEqual,
  registerConfigEnvironment,
  setConfigEnvironment
};
