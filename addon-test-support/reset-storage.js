import { _resetStorages } from 'ember-local-storage/helpers/storage';
import { deprecate } from '@ember/application/deprecations';

deprecate(
  '`ember-local-storage/test-support/reset-storage` has been deprecated. Please import `ember-local-storage/test-support/reset-storages` instead.', false, {
    "id": "ember-local-storage.reset-storages-singular",
    "until": "2.0.0"
  }
);

export default _resetStorages;
