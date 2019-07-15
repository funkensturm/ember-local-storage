function save() {
  this._super.apply(this, arguments);
  this._save();
}

function saveIfChanged(key) {
  this._super.apply(this, arguments);

  // TODO: v2.0 - Remove workaround and drop support for 2.12.x
  // Ember 2.12.x sets __OWNER__ and __NAME_KEY__ on factoryFor().create()
  // which results in a premature save  hat overwrites the already stored data.
  if (/^__OWNER|NAME_KEY__/.test(key)) {
    return;
  }

  if (key !== '_isInitialContent') {
    this._save();
  }
}

export {
  save,
  saveIfChanged
};
