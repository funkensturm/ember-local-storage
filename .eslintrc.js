'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    // 'plugin:prettier/recommended',
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/avoid-leaking-state-in-ember-objects': 'off',
    'ember/no-actions-hash': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-component-lifecycle-hooks': 'off',
    'ember/no-get': 'off',
    'ember/no-jquery': 'off',
    'ember/no-mixins': 'off',
    'ember/no-new-mixins': 'off',
    'ember/no-string-prototype-extensions': 'off',
    'ember/require-tagless-components': 'off',
    'ember/require-super-in-lifecycle-hooks': 'off',
    'ember/use-ember-data-rfc-395-imports': 'off',
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
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'ember/no-get': 'off',
        'qunit/no-assert-equal-boolean': 'off',
        'qunit/no-conditional-assertions': 'off',
        'qunit/no-ok-equality': 'off',
      },
    },
  ],
};
