import Ember from 'ember';
import StorageProxyMixin from './storage';
import { save } from '../helpers/utils';

const {
  A,
  Mixin,
  set
} = Ember;

export default Mixin.create(StorageProxyMixin, {
  _containedType: 'array',
  _initialContent: A(),
  _clear() { set(this, 'content', Ember.A()); },

  replaceContent: save,
  reset: save
});
