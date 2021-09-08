import Component from '@ember/component';
import { bind } from '@ember/runloop';

export default Component.extend({
  tagName: 'input',
  attributeBindings: ['type'],
  type: 'file',

  didInsertElement() {
    this._super(...arguments);
    this.element.addEventListener('change', bind(this, 'importData'));
  },
});
