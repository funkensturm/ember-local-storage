'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.4',
        npm: {
          devDependencies: {
            'ember-data': '~3.4.0',
            'ember-source': '~3.4.0',
          },
        },
      },
      {
        name: 'ember-lts-3.8',
        npm: {
          devDependencies: {
            'ember-data': '~3.8.0',
            'ember-source': '~3.8.0',
          },
        },
      },
      {
        name: 'ember-lts-3.12',
        npm: {
          devDependencies: {
            'ember-data': '~3.12.0',
            'ember-source': '~3.12.0',
          },
        },
      },
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
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-data': 'latest',
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-data': 'beta',
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-data': 'canary',
            'ember-source': await getChannelURL('canary'),
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
