/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-local-storage',

  included: function included(app) {
    var config = require(app.options.configPath)();
    var options = config['ember-local-storage'] || {};

    this._super.included.apply(this, arguments);

    if (options.fileExport) {
      app.import('vendor/save-as.js');
      app.import(app.bowerDirectory + '/blob-polyfill/Blob.js');
    }
  }
};
