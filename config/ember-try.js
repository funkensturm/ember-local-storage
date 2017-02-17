module.exports = {
  scenarios: [
    {
      name: 'default',
      npm: {
        devDependencies: {
        }
      },
      bower: {
        dependencies: {
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#beta',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': 'ember#beta',
        }
      }
    },
    {
      name: 'ember-canary',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#master',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': 'ember#canary',
        }
      }
    },
    // Legacy
    {
      name: 'ember-lts-2.4',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': null,
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-4',
          'ember-data': '~2.4.0',
          'ember-cli-shims': '0.1.3'
        },
        resolutions: {
          'ember': 'lts-2-4'
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': 'components/ember#lts-2-8'
        },
        resolutions: {
          'ember': 'lts-2-8'
        }
      }
    },
    {
      name: 'ember-2.10',
      npm: {
        devDependencies: {
          'ember-data': '~2.10.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.10.0'
        }
      }
    },
    {
      name: 'ember-2.9',
      npm: {
        devDependencies: {
          'ember-data': '~2.9.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.9.0'
        }
      }
    },
    {
      name: 'ember-2.8',
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.8.0'
        }
      }
    },
    {
      name: 'ember-2.7',
      npm: {
        devDependencies: {
          'ember-data': '~2.7.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.7.0'
        }
      }
    },
    {
      name: 'ember-2.6',
      npm: {
        devDependencies: {
          'ember-data': '~2.6.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.6.0'
        }
      }
    },
    {
      name: 'ember-2.5',
      npm: {
        devDependencies: {
          'ember-data': '~2.5.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.5.0'
        }
      }
    },
    {
      name: 'ember-2.4',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~2.4.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.4.0',
          'ember-cli-shims': '0.1.3'
        }
      }
    },
    {
      name: 'ember-2.3',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': '~2.3.0',
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.3.0',
          'ember-cli-shims': '0.1.3'
        }
      }
    },
    {
      name: 'ember-2.2',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': null,
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.2.0',
          'ember-data': '~2.3.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-2.1',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': null,
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.1.0',
          'ember-data': '~2.3.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-2.0',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': null,
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~2.0.0',
          'ember-data': '~2.3.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    },
    {
      name: 'ember-1.13',
      npm: {
        devDependencies: {
          'ember-cli-shims': null,
          'ember-data': null,
          'ember-source': null
        }
      },
      bower: {
        dependencies: {
          'ember': '~1.13.0',
          'ember-data': '~2.3.0',
          'ember-cli-shims': '0.0.6'
        }
      }
    }
  ]
};
