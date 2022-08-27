import Component from '@glimmer/component';
import { action } from '@ember/object';
import hljs from 'highlight.js';

export default class HighlightJsComponent extends Component {
  get lang() {
    return this.args.lang || 'js';
  }

  @action
  highlight(element) {
    element.innerHTML = element.innerHTML.trim();
    hljs.highlightElement(element);
  }
}
