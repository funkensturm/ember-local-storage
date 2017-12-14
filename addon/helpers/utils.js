function save() {
  this._super.apply(this, arguments);
  this._save();
}

function saveIfChanged(key) {
  this._super.apply(this, arguments);

  if (key !== '_isInitialContent') {
    this._save();
  }
}

const forageMarker = '__isLocalForage';

function setLocalForage(storage) {
  storage[forageMarker] = true;
}

function isLocalForage(storage) {
  // if somehow `localStorage.__isLocalForage = true` is set, it
  // will be retrieved as `"true"` and function will return false
  return storage[forageMarker] === true;
}

export {
  save,
  saveIfChanged
};
