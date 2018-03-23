/* eslint guard-for-in: "off"*/
import TypeView from '../type-view';
import {createTypedView} from '../utils';
import {Mode, Class} from '../enums';

const MAX_HEAD_ELEMENTS_LENGTH = 5;

export default class ObjectView extends TypeView {
  constructor(value, mode) {
    super(value, `object`, false);
    this._mode = mode;
    this._entries = new Map();
    this._isOpened = false;
  }

  /**
   * Шаблон
   * @override
   * Чтобы окружить фигурными скобками тело объекта, добавьте к элемену с классом
   * Class.CONSOLE_ITEM_CONTENT_CONTAINTER
   * класс
   * Class.ENTRY_CONTAINER_BRACED
   *
   **/
  get template() {
    return `\
<div class="console__item item item_object">\
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS} entry-container entry-container_head entry-container_type_object"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container entry-container_type_object"></div>
</div>`;
  }

  bind() {
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    const headElementsEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    const headInfoEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);

    const {elOrStr, isShowConstructor, isShowElements, isBraced, isOpeningDisabled, isOversize, isStringified} = this._getHeadContent();
    if (isBraced) {
      headElementsEl.classList.add(Class.ENTRY_CONTAINER_BRACED);
    }
    if (isOversize) {
      headElementsEl.classList.add(Class.ENTRY_CONTAINER_OVERSIZE);
    }
    if (isShowConstructor) {
      headInfoEl.classList.add(Class.CONSOLE_ITEM_HEAD_SHOW);
    }
    if (isShowElements) {
      if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
        headElementsEl.appendChild(elOrStr);
      } else {
        headElementsEl.innerHTML = elOrStr;
      }
      headElementsEl.classList.add(Class.CONSOLE_ITEM_HEAD_ELEMENTS_SHOW);
    }

    if (this._mode === Mode.ERROR && isStringified) {
      this.el.classList.add(this._mode);
    }

    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (!isOpeningDisabled) {
      this._setHeadClickHandler(headEl);
    }
  }

  _getHeadContent() {
    if (this._mode === Mode.DIR) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode.LOG || this._mode === Mode.PROP || this._mode === Mode.ERROR) {
      return this._getHeadLogContent();
    } else if (this._mode === Mode.PREVIEW) {
      return this._getHeadPreviewContent();
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
    let isOpeningDisabled = false;
    let isOversize = false;
    let isStringified = false;

    if (this.value instanceof HTMLElement) {
      return this._getHeadDirContent();
    } else if (this.value instanceof Error) {
      isBraced = false;
      val = this.value.toString();
      isStringified = true;
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
      isStringified = true;
      isBraced = false;
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this.value, true);
      val = obj.fragment;
      isOversize = obj.isOversize;
      if (this.value.constructor !== Object) {
        isShowConstructor = true;
      }
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isShowElements: true,
      isBraced,
      isOpeningDisabled,
      isOversize,
      isStringified
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
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
    } else if (this.value instanceof Error) {
      val = this.value.toString();
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
      if (isPreview && keys.size === MAX_HEAD_ELEMENTS_LENGTH) {
        return {
          fragment,
          isOversize: true
        };
      }
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    for (let key of Object.getOwnPropertyNames(obj)) {
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      if (isPreview && keys.size === MAX_HEAD_ELEMENTS_LENGTH) {
        return {
          fragment,
          isOversize: true
        };
      }
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return {
      fragment,
      isOversize: false
    };
  }
}
