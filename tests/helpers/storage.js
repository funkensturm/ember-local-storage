function storageEqual(actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  equal(actual, expected, message);
}

function storageDeepEqual(actual, expected, message) {
  actual = actual ? JSON.parse(actual) : undefined;
  deepEqual(actual, expected, message);
}

export {
  storageEqual,
  storageDeepEqual
};