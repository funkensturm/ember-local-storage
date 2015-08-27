/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-local-storage',

  included: function included(app) {
    var projectConfig = this.project.config(app.env);

    if (projectConfig) {
      var options = projectConfig['ember-local-storage'] || {};

      if (options.fileExport) {
        app.import('vendor/save-as.js');
        app.import(app.bowerDirectory + '/blob-polyfill/Blob.js');
      }
    }

    this._super.included.apply(this, arguments);
  }
};
