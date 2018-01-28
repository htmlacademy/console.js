import TypeView from '../type-view';
import {getElement, createTypedView} from '../utils';
import {Mode, Class} from '../enums';

export default class ArrayView extends TypeView {
  constructor(arr, mode) {
    super(arr, `array`, false);
    this._arr = arr;
    this._mode = mode;
    this._elements = new Map();
    this._isOpened = false;
  }

  get template() {
    return `\
<div class="console__item array">
  <div class="${Class.CONSOLE_ITEM_HEAD} \
${this._mode === Mode.PREVIEW ? Class.CONSOLE_ITEM_HEAD_SIZE : Class.CONSOLE_ITEM_HEAD_ELEMENTS}">\
${this._mode === Mode.PREVIEW ? `Array(${this._arr.length})` : ``}</div>\
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>
</div>`;
  }

  bind() {
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    const previewEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    previewEl.appendChild(this.createContent(this.value, true));

    previewEl.addEventListener(`click`, () => {
      if (this._isOpened) {
        this._hideContent();
      } else {
        this._showContent();
      }
      this._isOpened = !this._isOpened;
    });
  }

  _showContent() {
    if (!this._proxiedContentEl) {
      this._proxiedContentEl = getElement(`<div class="console__item-content"></div>`);
      this._proxiedContentEl.appendChild(this.createContent(this.value, false));
    }

    this._contentContainerEl.appendChild(this._proxiedContentEl);
  }

  _hideContent() {
    this._contentContainerEl.innerHTML = ``;
  }

  createContent(arr, isPreview) {
    const ownPropertyNames = Object.getOwnPropertyNames(arr);
    const keys = Object.keys(arr);
    const fragment = document.createDocumentFragment();
    for (let key of ownPropertyNames) {
      const value = arr[key];
      const indexInKeys = keys.indexOf(key);
      const isKeyNaN = Number.isNaN(Number.parseInt(key, 10));
      if (isPreview && indexInKeys === -1) {
        continue;
      }
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.DIR);
      const entryEl = ArrayView.createEntryEl(key, view.el, isPreview ? !isKeyNaN : isPreview);
      // if (!isPreview) {
      //   this._elements.set(entryEl, view);
      // }
      fragment.appendChild(entryEl);
    }
    return fragment;
  }

  static createEntryEl(index, valueEl, withKey) {
    const entryEl = getElement(`\
<span class="array__entry array-entry">\
  ${withKey ? `` : `<span class="array-entry__key">${index}</span>`}<span class="array-entry__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.array-entry__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }
}
