import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

const STRING_EXPANDED = `string--expanded`;

export default class PrimitiveView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.PRIMITIVE;
  }

  get template() {
    const type = this._type;
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
        html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item--primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item--primitive number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        }
        break;

      case `string`:
        let str;
        if (this._mode === Mode.PREVIEW && value.length > 100) {
          str = `${value.substr(0, 50)}...${value.substr(-50)}`;
        } else {
          str = value;
        }
        html = `<pre class="console__item item item--primitive string ${this._mode === Mode.PROP || this._mode === Mode.PREVIEW ? `string--nowrap` : ``} ${this._mode === Mode.PROP ? `pointer` : ``} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">${str}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item--primitive symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item--primitive null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this._mode === Mode.PROP && this._type === `string`) {
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(`string--nowrap`);
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
