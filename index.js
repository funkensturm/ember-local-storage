/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-local-storage',
  included: function colpick_included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/save-as.js');
  }
};
