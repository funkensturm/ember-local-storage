function save() {
  this._super.apply(this, arguments);
  return this._save();
}

function saveIfChanged(key) {
  this._super.apply(this, arguments);

  if (key !== '_isInitialContent') {
    return this._save();
  } else {
    return this;
  }
}

function preSerialize(obj) {
  // Fast way to remove functions and non-serializable attributes
  // so that IndexedDB and WebSQL are happy
  return JSON.parse(JSON.stringify(obj));
}

export {
  save,
  saveIfChanged,
  preSerialize
};
