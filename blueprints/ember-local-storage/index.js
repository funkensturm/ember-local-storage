'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    this.addBowerPackagesToProject([
      { name: 'blob-polyfill', target: '~1.0.20150320' },
    ]);
  }
};