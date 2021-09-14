import Mixin from '@ember/object/mixin';
import { importData, exportData } from 'ember-local-storage/helpers/import-export';

export default Mixin.create({
  importData(store, content, options) {
    return importData(store, content, options);
  },

  exportData(store, types, options) {
    return exportData(store, types, options);
  }
});
