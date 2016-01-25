import Ember from 'ember';
import hljs from 'highlightjs';
import { highlightBlock } from 'highlightjs';

export default Ember.Component.extend({
  tagName: 'pre',
  lang: 'js',

  didInsertElement() {
    this.$('code').text(this.$('code').text().trim());
    hljs.configure({tabReplace: '  '});
    highlightBlock(this.$('code')[0]);
  }
});