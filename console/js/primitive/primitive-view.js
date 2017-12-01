import TypeView from '../type-view';
import {getElement} from '../utils';

export default class PrimitiveView extends TypeView {
  constructor(value, type) {
    super(value, type, true);
  }

  get template() {
    const type = this.type;
    let html = '';
    switch (type) {
      case 'undefined':
        html = '<div class="console__item ' + type + '">' + type + '</div>';
        break;

      case 'number':
        if (window.isNaN(val)) {
          html = '<div class="console__item NaN">NaN</div>';
        } else if ((val === Infinity || val === -Infinity)) {
          html = '<div class="console__item number">' + (val === -Infinity ? '-' : '') + 'Infinity</div>';
        } else {
          html = '<div class="console__item ' + type + '">' + val + '</div>';
        }
        break;

      case 'string':
        html = '<div class="console__item ' + type + '">"' + val + '"</div>';
        break;

      case 'null':
      case 'boolean':
        html = '<div class="console__item ' + type + '">' + val + '</div>';
        break;
      case 'symbol':
        html = '<div class="console__item ' + type + '">' + val.toString() + '</div>';
        break;

      case 'object':
        if (val === null) {
          html = '<div class="console__item null">' + val + '</div>';
          break;
        }
    }
    return html;
  }
};
