/* eslint-env node */
'use strict';

var stew = require('broccoli-stew');
var VersionChecker = require('ember-cli-version-checker');
var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-local-storage',

  included: function included(app) {
    // determine if ember-data is present
    var checker = new VersionChecker(this);
    var bowerDep = checker.for('ember-data', 'bower');
    var npmDep = checker.for('ember-data', 'npm');

    if (
      (
        bowerDep.version && (
          bowerDep.satisfies('>= 1.13.0') ||
          bowerDep.satisfies('>= 2.0.0') ||
          bowerDep.gt('2.0.0')
        )
      ) ||
      (
        npmDep.version  && (
          npmDep.satisfies('>= 1.13.0') ||
          npmDep.satisfies('>= 2.0.0') ||
          npmDep.gt('2.0.0')
        )
      )
    ) {
      this.hasEmberData = true;
    }

    // determin if saveAs and Blob should be imported
    var projectConfig = this.project.config(app.env);

    if (projectConfig) {
      var options = projectConfig['ember-local-storage'] || {};

      if (options.fileExport && this.hasEmberData) {
        app.import('vendor/save-as.js');
        app.import('vendor/Blob.js');
      }
    }

    this._super.included.apply(this, arguments);
  },

  treeForApp: function(tree) {
    if (!this.hasEmberData) {
      [
        'initializers/local-storage-adapter.js'
      ].forEach(function(file) {
        tree = stew.rm(tree, file);
      });
    }

    return tree;
  },

  treeForAddon: function(tree) {
    if (!this.hasEmberData) {
      [
        'adapters/adapter.js',
        'adapters/base.js',
        'adapters/local.js',
        'adapters/session.js',
        'initializers/local-storage-adapter.js',
        'mixins/adapters/import-export.js',
        'serializers/serializer.js'
      ].forEach(function(file) {
        tree = stew.rm(tree, file);
      });
    }

    return this._super.treeForAddon.call(this, tree);
  },

  treeForVendor(vendorTree) {
    var blobTree = new Funnel(path.dirname(require.resolve('blob-polyfill')), {
      files: ['Blob.js']
    });

    return mergeTrees([vendorTree, blobTree]);
  }
};
