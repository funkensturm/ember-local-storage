module.exports = {
  scenarios: [
    {
      name: 'default',
      bower: {
        dependencies: {
        }
      },
      npm: {
        devDependencies: {
        }
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta',
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember': 'beta',
        'ember-data': 'beta'
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary',
          'ember-data': 'components/ember-data#canary'
        },
        resolutions: {
          'ember': 'canary',
          'ember-data': 'canary'
        }
      }
    },
    // Legacy
    {
      name: 'ember-2.8',
      bower: {
        dependencies: {
          'ember': '~2.8.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0'
        }
      }
    },
    {
      name: 'ember-2.7',
      bower: {
        dependencies: {
          'ember': '~2.7.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.7.0'
        }
      }
    },
    {
      name: 'ember-2.6',
      bower: {
        dependencies: {
          'ember': '~2.6.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.6.0'
        }
      }
    },
    {
      name: 'ember-2.5',
      bower: {
        dependencies: {
          'ember': '~2.5.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.5.0'
        }
      }
    },
    {
      name: 'ember-2.4',
      bower: {
        dependencies: {
          'ember': '~2.4.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.4.0'
        }
      }
    },
    {
      name: 'ember-2.3',
      bower: {
        dependencies: {
          'ember': '~2.3.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.3.0'
        }
      }
    },
    {
      name: 'ember-2.2',
      bower: {
        dependencies: {
          'ember': '~2.2.0',
          'ember-data': '~2.2.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-2.1',
      bower: {
        dependencies: {
          'ember': '~2.1.0',
          'ember-data': '~2.1.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          'ember': '~2.0.0',
          'ember-data': '~2.0.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '~1.13.0',
          'ember-data': '~1.13.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    }
  ]
};
