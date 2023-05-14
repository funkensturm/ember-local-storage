import { deprecate } from '@ember/debug';
import Mixin from '@ember/object/mixin';
import {
  importData,
  exportData,
} from 'ember-local-storage/helpers/import-export';

export default Mixin.create({
  importData(store, content, options) {
    deprecate(
      'Using the import-export mixin has been deprecated and will be removed in version 3.0.0',
      false,
      {
        for: 'ember-local-storage',
        id: 'ember-local-storage.mixins.adapters.import-export',
        since: '2.0.5',
        until: '3.0.0',
        url: 'https://github.com/funkensturm/ember-local-storage#deprecations',
      }
    );
    return importData(store, content, options);
  },

  exportData(store, types, options) {
    deprecate(
      'Using the import-export mixin has been deprecated and will be removed in version 3.0.0',
      false,
      {
        for: 'ember-local-storage',
        id: 'ember-local-storage.mixins.adapters.import-export',
        since: '2.0.5',
        until: '3.0.0',
        url: 'https://github.com/funkensturm/ember-local-storage#deprecations',
      }
    );
    return exportData(store, types, options);
  },
});
