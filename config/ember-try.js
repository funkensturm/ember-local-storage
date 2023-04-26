'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.16',
        npm: {
          devDependencies: {
            'ember-data': '~3.16.0',
            'ember-source': '~3.16.0',
          },
        },
      },
      {
        name: 'ember-lts-3.20',
        npm: {
          devDependencies: {
            'ember-data': '~3.20.0',
            'ember-source': '~3.20.5',
          },
        },
      },
      {
        name: 'ember-lts-3.24',
        npm: {
          devDependencies: {
            'ember-data': '~3.24.0',
            'ember-source': '~3.24.3',
          },
        },
      },
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-data': '~3.28.0',
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-lts-4',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.0.0',
            '@ember-data/debug': '~4.0.0',
            '@ember-data/model': '~4.0.0',
            '@ember-data/record-data': '~4.0.0',
            '@ember-data/serializer': '~4.0.0',
            '@ember-data/store': '~4.0.0',
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.0.0',
            'ember-source': '~4.0.0',
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.4.0',
            '@ember-data/debug': '~4.4.0',
            '@ember-data/model': '~4.4.0',
            '@ember-data/record-data': '~4.4.0',
            '@ember-data/serializer': '~4.4.0',
            '@ember-data/store': '~4.4.0',
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.4.0',
            'ember-source': '~4.4.0',
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            '@ember-data/adapter': '~4.8.0',
            '@ember-data/debug': '~4.8.0',
            '@ember-data/model': '~4.8.0',
            '@ember-data/record-data': '~4.8.0',
            '@ember-data/serializer': '~4.8.0',
            '@ember-data/store': '~4.8.0',
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.8.0',
            'ember-source': '~4.8.0',
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': 'latest',
            'ember-source': await getChannelURL('release'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': 'beta',
            'ember-source': await getChannelURL('beta'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': 'canary',
            'ember-source': await getChannelURL('canary'),
            webpack: '^5.0.0',
          },
        },
      },
      {
        name: 'ember-default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^1.1.0',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
