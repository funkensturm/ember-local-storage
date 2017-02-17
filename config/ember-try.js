module.exports = {
  scenarios: [
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4'
        },
        resolutions: {
          'ember': 'lts-2-4'
        }
      },
      npm: {
        devDependencies: {
          'ember-data': '~2.4.0'
          'ember-source': null
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
          'ember-source': null
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
          'ember-source': null
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
          'ember-data': '~2.8.0'
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
          'ember-data': '~2.9.0'
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
          'ember-data': '~2.10.0'
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
          'ember-data': 'components/ember-data#release'
        },
        resolutions: {
          'ember': 'release'
          'ember-data': 'release'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
          'ember-data': 'components/ember-data#beta'
        },
        resolutions: {
          'ember': 'beta'
          'ember-data': 'beta'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
          'ember-data': 'components/ember-data#canary'
        },
        resolutions: {
          'ember': 'canary'
          'ember-data': 'canary'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
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
