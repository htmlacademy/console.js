import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';
import {escapeHTML} from '../utils';

export default class PrimitiveView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.PRIMITIVE;
  }

  get template() {
    const type = this._type;
    let value = this._value;
    let html = ``;
    if (type === `string` || type === `symbol`) {
      if (type === `symbol`) {
        value = value.toString();
      }

      if (this._parentView ? this._parentView.mode !== Mode.LOG_HTML : this._mode !== Mode.LOG_HTML) {
        value = escapeHTML(value);
      }
    }
    switch (type) {
      case `undefined`:
      case `null`:
      case `boolean`:
        html = `<div class="console__item item item--primitive c-${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item--primitive c-NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item--primitive c-number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item--primitive c-${type}">${value}</div>`;
        }
        break;

      case `string`:
        let str;
        if (this._mode === Mode.PREVIEW && value.length > 100) {
          str = `${value.substr(0, 50)}...${value.substr(-50)}`;
        } else {
          str = value;
        }
        html = `<pre class="console__item item item--primitive c-string ${this._mode === Mode.PROP || this._mode === Mode.PREVIEW ? `nowrap` : ``} ${this._mode === Mode.PROP ? `pointer` : ``} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">${str}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item--primitive c-symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item--primitive c-null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  _bind() {
    if (this._mode === Mode.PROP && this._type === `string`) {
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(`nowrap`);
      });
    }
  }
}
