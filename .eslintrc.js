'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/avoid-leaking-state-in-ember-objects': 0,
    'ember/no-classic-classes': 0,
    'ember/no-classic-components': 0,
    'ember/no-component-lifecycle-hooks': 0,
    'ember/no-jquery': 0,
    'ember/no-mixins': 0,
    'ember/no-new-mixins': 0,
    'ember/no-string-prototype-extensions': 0,
    'ember/require-tagless-components': 0,
    'ember/use-ember-data-rfc-395-imports': 0,
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'ember/no-get': 0,
        'qunit/no-conditional-assertions': 0,
      },
    },
  ],
};
