import TypeView from '../type-view';
import {getElement} from '../utils';

export default class PrimitiveView extends TypeView {
  constructor(value, type) {
    super(value, type, true);
  }

  get template() {
    const type = this.type;
    const value = this.value;
    let html = '';
    switch (type) {
      case 'undefined':
        html = '<div class="console__item ' + type + '">' + type + '</div>';
        break;

      case 'number':
        if (window.isNaN(value)) {
          html = '<div class="console__item NaN">NaN</div>';
        } else if ((value === Infinity || value === -Infinity)) {
          html = '<div class="console__item number">' + (value === -Infinity ? '-' : '') + 'Infinity</div>';
        } else {
          html = '<div class="console__item ' + type + '">' + value + '</div>';
        }
        break;

      case 'string':
        html = '<div class="console__item ' + type + '">"' + value + '"</div>';
        break;

      case 'null':
      case 'boolean':
        html = '<div class="console__item ' + type + '">' + value + '</div>';
        break;
      case 'symbol':
        html = '<div class="console__item ' + type + '">' + value.toString() + '</div>';
        break;

      case 'object':
        if (value === null) {
          html = '<div class="console__item null">' + value + '</div>';
          break;
        }
    }
    return html;
  }
};
