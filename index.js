'use strict';

const stew = require('broccoli-stew');
const VersionChecker = require('ember-cli-version-checker');
const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  init(app) {
    this._super.init && this._super.init.apply(this, arguments);

    // determine if ember-data is present
    let checker = new VersionChecker(this);
    let npmDep = checker.for('ember-data', 'npm');

    if (
      npmDep.version &&
      (npmDep.satisfies('>= 1.13.0') ||
        npmDep.satisfies('>= 2.0.0') ||
        npmDep.gt('2.0.0'))
    ) {
      this.hasEmberData = true;
      this.loadInitializer = true;
    }

    if (
      npmDep.version &&
      (npmDep.satisfies('>= 4.12.0') || npmDep.gt('4.12.0'))
    ) {
      this.loadInitializer = false;
    }

    // determine if saveAs and Blob should be imported
    let projectConfig = this.project.config(app.env);
    let options = {};

    if (projectConfig) {
      options = projectConfig['ember-local-storage'] || {};

      if ('includeEmberDataSupport' in options) {
        this.hasEmberData = options.includeEmberDataSupport;
      }

      if (options.fileExport && this.hasEmberData) {
        this.needsFileExport = true;
      }

      if (options.loadInitializer === false) {
        this.loadInitializer = options.loadInitializer;
      }
    }
  },

  included: function included(app) {
    if (this.needsFileExport) {
      app.import('vendor/save-as.js');
      app.import('vendor/Blob.js');
    }

    this._super.included.apply(this, arguments);
  },

  treeForApp: function (tree) {
    if (!this.loadInitializer) {
      ['initializers/local-storage-adapter.js'].forEach(function (file) {
        tree = stew.rm(tree, file);
      });
    }

    return tree;
  },

  treeForAddon: function (tree) {
    if (!this.hasEmberData) {
      [
        'adapters/adapter.js',
        'adapters/base.js',
        'adapters/local.js',
        'adapters/session.js',
        'initializers/local-storage-adapter.js',
        'mixins/adapters/import-export.js',
        'serializers/serializer.js',
      ].forEach(function (file) {
        tree = stew.rm(tree, file);
      });
    }

    if (!this.loadInitializer) {
      ['initializers/local-storage-adapter.js'].forEach(function (file) {
        tree = stew.rm(tree, file);
      });
    }

    return this._super.treeForAddon.call(this, tree);
  },

  treeForVendor(vendorTree) {
    let blobTree = new Funnel(path.dirname(require.resolve('blob-polyfill')), {
      files: ['Blob.js'],
    });

    return mergeTrees([vendorTree, blobTree]);
  },
};
