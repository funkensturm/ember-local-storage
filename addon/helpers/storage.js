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

export {
  tryStorage,
  getStorage
};