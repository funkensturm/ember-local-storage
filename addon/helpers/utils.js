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

export { save, saveIfChanged };
