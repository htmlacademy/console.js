import TypeView from '../type-view';
import {Mode} from '../enums';

const STRING_COLLAPSED = `string_collapsed`;

export default class PrimitiveView extends TypeView {
  constructor(value, mode, type) {
    super(value, type, true);
    this._mode = mode;
  }

  get template() {
    const type = this.type;
    let value = this.value;
    let html = ``;
    if (type === `string` || type === `symbol`) {
      if (type === `symbol`) {
        value = value.toString();
      }
      value = this.escapeHtml(value);
    }
    switch (type) {
      case `undefined`:
      case `null`:
      case `boolean`:
        html = `<div class="console__item item item_primitive ${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item_primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item_primitive number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item_primitive ${type}">${value}</div>`;
        }
        break;

      case `string`:
        html = `<pre class="console__item item item_primitive string ${this._mode === Mode.PROP ? STRING_COLLAPSED : ``} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">${value}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item_primitive symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item_primitive null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this._mode === Mode.PROP && this.type === `string`) {
      this._setCursorPointer();
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(STRING_COLLAPSED);
      });
    }
  }

  escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, `&amp;`)
        .replace(/</g, `&lt;`)
        .replace(/>/g, `&gt;`)
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#039;`);
  }
}
