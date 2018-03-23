import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Class} from './enums';

export default class TypeView extends AbstractView {
  constructor({val, mode}, consoleExemplar) {
    super();
    this._value = val;
    this._mode = mode;
    this._consoleExemplar = consoleExemplar;
    this._isOpened = false;
  }

  get value() {
    return this._value;
  }

  get mode() {
    return this._mode;
  }

  _getHeadErrorContent() {
    return {
      elOrStr: this._value.toString(),
      isShowConstructor: false,
      isShowElements: true
    };
  }

  _toggleContent() {
    if (!this._proxiedContentEl) {
      this._proxiedContentEl = getElement(`<div class="console__item item-content"></div>`);
      this._proxiedContentEl.appendChild(this.createContent(this.value, false).fragment);
      this._contentContainerEl.appendChild(this._proxiedContentEl);
    }
    this._contentContainerEl.classList.toggle(Class.CONSOLE_ITEM_CONTENT_CONTAINTER_SHOW);
  }

  _hideContent() {
    this._proxiedContentEl.style.display = `none`;
  }

  _additionHeadClickHandler() {}

  _setHeadClickHandler(headEl) {
    this._setCursorPointer();
    headEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._toggleContent();
      this._additionHeadClickHandler();
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
