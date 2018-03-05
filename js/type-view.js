import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Class} from './enums';

export default class TypeView extends AbstractView {
  constructor(value, type, isPrimitive) {
    super();
    this._value = value;
    this._type = type;
    this._isPrimitive = isPrimitive;
    this._isOpened = false;
  }

  get value() {
    return this._value;
  }

  get type() {
    return this._type;
  }

  get isPrimitive() {
    return this._isPrimitive;
  }

  _getHeadErrorContent() {
    return {
      elOrStr: `<pre>${this._value.stack}</pre>`,
      isShowConstructor: false,
      isShowElements: true
    };
  }

  _showContent() {
    if (!this._proxiedContentEl) {
      this._proxiedContentEl = getElement(`<div class="console__item-content"></div>`);
      this._proxiedContentEl.appendChild(this.createContent(this.value, false));
      this._contentContainerEl.appendChild(this._proxiedContentEl);
      this._displayVal = this._proxiedContentEl.style.display;
    }
    this._proxiedContentEl.style.display = this._displayVal;
  }

  _hideContent() {
    this._proxiedContentEl.style.display = `none`;
  }

  _setHeadClickHandler(headEl) {
    this._setCursorPointer();
    headEl.addEventListener(`click`, () => {
      if (this._isOpened) {
        this._hideContent();
      } else {
        this._showContent();
      }
      this._isOpened = !this._isOpened;
    });
  }

  _setCursorPointer() {
    this.el.classList.add(Class.CONSOLE_ITEM_POINTER);
  }

  static createEntryEl(index, valueEl, withoutKey) {
    const entryEl = getElement(`\
<span class="entry-container__entry">\
  ${withoutKey ? `` : `<span class="entry-container__key">${index}</span>`}<span class="entry-container__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.entry-container__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }
}
