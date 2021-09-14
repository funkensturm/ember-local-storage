import Component from '@ember/component';
import hljs from 'highlightjs';
import { highlightBlock } from 'highlightjs';

export default Component.extend({
  tagName: 'pre',
  lang: 'js',

  didInsertElement() {
    this._super(...arguments);
    this.$('code').text(this.$('code').text().trim());
    hljs.configure({tabReplace: ' '});
    highlightBlock(this.$('code')[0]);
  }
});