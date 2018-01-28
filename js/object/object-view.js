/* eslint guard-for-in: "off"*/
import TypeView from '../type-view';
import {getElement, createTypedView} from '../utils';
import {Mode, Class} from '../enums';

export default class ObjectView extends TypeView {
  constructor(value, mode) {
    super(value, `object`, false);
    this._mode = mode;
    this._entries = new Map();
    this._isOpened = false;
  }

  get template() {
    return `
<div class="console__item object ${this.value.constructor.name} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">\
  <div class="${Class.CONSOLE_ITEM_HEAD}"></div>\
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>\
</div>`;
  }

  bind() {
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    // headEl.appendChild(this.createContent(this.value, true));

    const elOrStr = this._getHeadContent();
    if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
      headEl.appendChild(elOrStr);
    } else {
      headEl.innerHTML = elOrStr;
    }
    if (this._mode === Mode.PREVIEW || this._mode === Mode.ERROR) {
      return;
    }

    headEl.addEventListener(`click`, () => {
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

  _getHeadContent() {
    if (this.value.constructor === Object) {
      if (this._mode !== Mode.PREVIEW) {
        return this.createContent(this.value, true);
      }
      return `...`;
    }
    if (this._mode === Mode.DIR) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode.LOG) { // Временно выводим для .log .error и preview то же, что и для .dir
      return this._getHeadDirContent();
    } else if (this._mode === Mode.PREVIEW) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode.ERROR) {
      return this._getHeadErrorContent();
    }
    return ``;
  }

  _getHeadPreviewContent() {}
  _getHeadLogContent() {}
  _getHeadErrorContent() {
    return `<pre>${this.value.stack}</pre>`;
  }
  _getHeadDirContent() {
    if (this.value instanceof HTMLElement) {
      let str = this.value.tagName.toLowerCase();
      if (this.value.classList.length) {
        str += `.` + Array.prototype.join.call(this.value.classList, `.`);
      }
      return str;
    } else if (this.value instanceof Error) {
      return this.value.stack;
    }
    // else if (this.value.constructor === GeneratorFunction) {
    //   return this
    // }
    return this.value.constructor.name;
  }

  createContent(obj, isPreview) {
    const fragment = document.createDocumentFragment();
    const keys = new Set();
    for (let key in obj) {
      keys.add(key);
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    for (let key of Object.getOwnPropertyNames(obj)) {
      if (keys.has(key)) {
        continue;
      }
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return fragment;
  }

  static createEntryEl(key, valueEl) {
    const entryEl = getElement(`\
<span class="object__entry object-entry">
  <span class="object-entry__key">${key}</span><span class="object-entry__value-container"></span>
</span>`);
    const valueContEl = entryEl.querySelector(`.object-entry__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }
}
