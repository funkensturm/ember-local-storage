function storageEqual(assert, actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  assert.equal(actual, expected, message);
}

function storageDeepEqual(assert, actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  assert.deepEqual(actual, expected, message);
}

export {
  storageEqual,
  storageDeepEqual
};
