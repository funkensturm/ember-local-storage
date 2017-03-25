/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4',
          'ember-cli-shims': '0.1.0'
        },
        resolutions: {
          'ember': 'lts-2-4'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.4.0',
          'ember-cli-shims': null,
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8'
        },
        resolutions: {
          'ember': 'lts-2-8'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0',
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-2.9',
      bower: {
        dependencies: {
          'ember': '~2.9.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.9.0',
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-2.10',
      bower: {
        dependencies: {
          'ember': '~2.10.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.10.0',
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-2.11',
      npm: {
        devDependencies: {
          'ember-data': '~2.11.0',
          'ember-source': '~2.11.0'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        },
        resolutions: {
          'ember': 'release'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null,
          'ember-data': 'emberjs/data#release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null,
          'ember-data': 'emberjs/data#beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        },
        resolutions: {
          'ember': 'canary'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null,
          'ember-data': 'emberjs/data#master'
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};
