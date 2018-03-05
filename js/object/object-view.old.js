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
    const className = Object.prototype.toString.call(this.value).slice(8, -1);
    return `
<div class="console__item object ${className} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">\
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS}"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>
</div>`;
  }

  bind() {
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    const headElementsEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    const headInfoEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    // headEl.appendChild(this.createContent(this.value, true));

    const {elOrStr, isShowConstructor, isShowElements, isBraced} = this._getHeadContent();
    if (isBraced) {
      headEl.classList.add(Class.CONSOLE_ITEM_HEAD_BRACED);
    }
    if (isShowConstructor) {
      headInfoEl.style.display = `inline`;
    }
    if (isShowElements) {
      if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
        headElementsEl.appendChild(elOrStr);
      } else {
        headElementsEl.innerHTML = elOrStr;
      }
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
      this._contentContainerEl.appendChild(this._proxiedContentEl);
      this._displayVal = this._proxiedContentEl.style.display;
    }

    this._proxiedContentEl.style.display = this._displayVal;
  }

  _hideContent() {
    this._proxiedContentEl.style.display = `none`;
  }

  _getHeadContent() {
    if (this._mode === Mode.DIR) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode.LOG || this._mode === Mode.PROP) {
      return this._getHeadLogContent();
    } else if (this._mode === Mode.PREVIEW) {
      return this._getHeadPreviewContent();
    } else if (this._mode === Mode.ERROR) {
      return this._getHeadErrorContent();
    }
    return ``;
  }

  _getHeadPreviewContent() {
    if (Object.prototype.toString.call(this.value) === `[object Object]`) {
      return {
        elOrStr: `...`,
        isShowConstructor: false,
        isShowElements: true,
        isBraced: true
      };
    }
    return this._getHeadDirContent();
  }
  _getHeadLogContent() {
    let val;
    let isShowConstructor = false;
    let isBraced = true;
    if (Object.prototype.toString.call(this.value) === `[object Object]`) {
      val = this.createContent(this.value, true);
      if (this.value.constructor !== Object) {
        isShowConstructor = true;
      }
    } else if (this.value instanceof HTMLElement) {
      return this._getHeadDirContent();
    } else if (this.value instanceof Error) {
      val = this.value.stack;
    } else if (this.value instanceof Number) {
      const view = createTypedView(Number.parseInt(this.value, 10), Mode.PREVIEW);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof String) {
      const view = createTypedView(this.value.toString(), Mode.PREVIEW);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
      isBraced = false;
    } else {
      val = this.createContent(this.value, true);
      isShowConstructor = true;
    }
    // else if (this.value.constructor === GeneratorFunction) {
    //   return this
    // }
    return {
      elOrStr: val,
      isShowConstructor,
      isShowElements: true,
      isBraced
    };
  }
  _getHeadErrorContent() {

    return {
      elOrStr: `<pre>${this.value.stack}</pre>`,
      isShowConstructor: false,
      isShowElements: true
    };
  }
  _getHeadDirContent() {
    let val;
    let isShowConstructor = false;
    let isShowElements = true;
    let isBraced = false;
    if (this.value instanceof HTMLElement) {
      let str = this.value.tagName.toLowerCase();
      str += this.value.id;
      if (this.value.classList.length) {
        str += `.` + Array.prototype.join.call(this.value.classList, `.`);
      }
      val = str;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
    } else if (this.value instanceof Error) {
      val = this.value.stack;
    } else {
      val = this.value;
      isShowConstructor = true;
      isShowElements = false;
    }
    // else if (this.value.constructor === GeneratorFunction) {
    //   return this
    // }
    return {
      elOrStr: val,
      isShowConstructor,
      isShowElements,
      isBraced
    };
  }

  createContent(obj, isPreview) {
    const fragment = document.createDocumentFragment();
    const keys = new Set();
    // TODO: Добавить счётчик, чтобы больше 5 значений не добавлялось
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
