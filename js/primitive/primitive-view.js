import TypeView from '../type-view';
import {Mode} from '../enums';

const Class = {
  STRING_COLLAPSED: `string_collapsed`
};

export default class PrimitiveView extends TypeView {
  constructor(value, mode, type) {
    super(value, type, true);
    this._mode = mode;
  }

  get template() {
    const type = this.type;
    const value = this.value;
    let html = ``;
    switch (type) {
      case `undefined`:
      case `null`:
      case `boolean`:
        html = `<div class="console__item console__item_primitive ` + type + `">` + value + `</div>`;
        break;

      case `number`:
        if (isNaN(value)) {
          html = `<div class="console__item console__item_primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item console__item_primitive number">` + (value === -Infinity ? `-` : ``) + `Infinity</div>`;
        } else {
          html = `<div class="console__item console__item_primitive ` + type + `">` + value + `</div>`;
        }
        break;

      case `string`:
        const escaped = this.escapeHtml(value);
        html = `<pre class="console__item console__item_primitive string ${this._mode === Mode.PROP ? Class.STRING_COLLAPSED : ``}">${escaped}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item console__item_primitive ` + type + `">` + value.toString() + `</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item console__item_primitive null">` + value + `</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this.type === `string`) {
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(Class.STRING_COLLAPSED);
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
