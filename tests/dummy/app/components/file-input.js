import Component from '@ember/component';
import { bind } from '@ember/runloop';

export default Component.extend({
  tagName: 'input',
  attributeBindings: ['type'],
  type: 'file',

  didInsertElement() {
    this.element.addEventListener('change', bind(this, 'importData'));
  }
});