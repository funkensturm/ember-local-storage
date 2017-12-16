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

export {
  save,
  saveIfChanged
};
