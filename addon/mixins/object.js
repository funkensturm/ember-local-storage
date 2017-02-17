import Ember from 'ember';
import StorageProxyMixin from './storage';
import { save, saveIfChanged } from '../helpers/utils';

const {
  Mixin,
  set
} = Ember;

export default Mixin.create(StorageProxyMixin, {
  _initialContent: {},
  _clear() { set(this, 'content', {}); },

  setUnknownProperty: saveIfChanged,
  set: saveIfChanged,
  setProperties: save
});
