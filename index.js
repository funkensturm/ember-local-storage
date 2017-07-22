/* eslint-env node */
'use strict';

const stew = require('broccoli-stew');
const VersionChecker = require('ember-cli-version-checker');
const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-local-storage',

  _warn(message) {
    let chalk = require('chalk');
    let warning = chalk.yellow('WARNING: ' + message);

    if (this.ui && this.ui.writeWarnLine) {
      this.ui.writeWarnLine(message);
    } else if (this.ui) {
      this.ui.writeLine(warning);
    } else {
      console.log(warning);
    }
  },

  init(app) {
    this._super.init && this._super.init.apply(this, arguments);

    // determine if ember-data is present
    let checker = new VersionChecker(this);
    let bowerDep = checker.for('ember-data', 'bower');
    let npmDep = checker.for('ember-data', 'npm');

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
    let projectConfig = this.project.config(app.env);
    let options = {};

    if (projectConfig) {
      options = projectConfig['ember-local-storage'] || {};

      if (options.fileExport && this.hasEmberData) {
        this.needsFileExport = true;
      }
    }

    // Inform the user about the transition to npm dependencies
    if (this.needsFileExport && !options.ignoreBlobWarning) {
      let bowerDeps = this.project.bowerDependencies();

      if (bowerDeps['blob-polyfill']) {
        this._warn('Please remove `blob-polyfill` from `bower.json`. As of ' +
                   'Ember localStorage 1.4.0 the `blob-polyfill` NPM ' +
                   'package is a dependency. If other code depends on the ' +
                   'bower package add `ignoreBlobWarning: true` to ' +
                   '`ember-local-storage` config in `environment.js` to ' +
                   'ignore this warning.'
                  );
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
    let blobTree = new Funnel(path.dirname(require.resolve('blob-polyfill')), {
      files: ['Blob.js']
    });

    return mergeTrees([vendorTree, blobTree]);
  }
};
