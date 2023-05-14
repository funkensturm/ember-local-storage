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
        name: 'ember-4',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.0.0',
            'ember-source': '~4.0.0',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.4.0',
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.8.0',
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-4.11',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.11.0',
            'ember-source': '~4.11.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-auto-import': '^2.2.0',
            'ember-data': '~4.12.0',
            'ember-source': '~4.12.0',
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
            'ember-resolver': '10.0.0',
            '@ember/string': '3.0.1',
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
            'ember-resolver': '10.0.0',
            '@ember/string': '3.0.1',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
