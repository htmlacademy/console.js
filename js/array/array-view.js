import TypeView from '../type-view';
// import {createTypedView} from '../utils';
import {Mode, Class, ViewType} from '../enums';

export default class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    if (!params.parentView) {
      this._rootViewType = ViewType.ARRAY;
    }
    this._viewType = ViewType.ARRAY;
    this._elements = new Map();
    this._isOpened = false;
  }

  /**
   * Шаблон
   * @override
   * Чтобы окружить квадратными скобками тело объекта, добавьте к элемену с классом
   * Class.CONSOLE_ITEM_CONTENT_CONTAINTER
   * класс
   * Class.ENTRY_CONTAINER_BRACED
   *
   **/
  get template() {
    return `\
<div class="console__item item item_array">
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <span class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}">${this.value.length}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS} entry-container entry-container_head entry-container_braced entry-container_type_array"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>
</div>`;
  }

  bind() {
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    this.headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    this.headInfoEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    this.headElementsEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    this.headElementsLengthEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}`);
    const {isShowConstructor, isShowElements, isShowLength} = this._getHeadContent();
    if (isShowConstructor) {
      this._toggleConstructor(this.headInfoEl, true);
    }
    if (isShowElements) {
      this.headElementsEl.appendChild(this.createContent(this.value, true).fragment);
      this._toggleHeadElements(this.headElementsEl, true);
    }
    if (isShowLength) {
      this._toggleLength(this.headElementsLengthEl, true);
    }
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler(this.headEl);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP) {
      this._toggleConstructor();
      this._toggleHeadElements();
    }
  }

  _toggleConstructor() {
    this.headInfoEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_SHOW);
  }

  _toggleLength() {
    this.headElementsLengthEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH_SHOW);
  }

  _toggleHeadElements() {
    this.headElementsEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_ELEMENTS_SHOW);
  }

  _getHeadContent() {
    let isShowConstructor = false;
    let isShowElements = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowConstructor = true;
      isShowElements = false;
    // } else if (this._mode === Mode.PROP) {
    } else if (this._mode === Mode.PREVIEW) {
      isShowConstructor = true;
      isShowElements = false;
      isShowLength = true;
    } else if (this._mode === Mode.ERROR) {
      return this._getHeadErrorContent();
    }
    return {
      isShowConstructor,
      isShowElements,
      isShowLength
    };
  }

  createContent(arr, isPreview) {
    const keys = Object.keys(arr);
    const addedKeys = new Set();
    const fragment = document.createDocumentFragment();
    for (let key of keys) {
      addedKeys.add(key);
      const val = arr[key];
      fragment.appendChild(this._createArrayEntryEl(key, val, isPreview));
    }
    for (let key of Object.getOwnPropertyNames(arr)) {
      if (addedKeys.has(key)) {
        continue;
      }
      if (isPreview && keys.indexOf(key) === -1) {
        continue;
      }
      const val = arr[key];
      fragment.appendChild(this._createArrayEntryEl(key, val, isPreview));
    }
    return {fragment};
  }

  _createArrayEntryEl(key, val, isPreview) {
    const isKeyNaN = Number.isNaN(Number.parseInt(key, 10));
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this);
    return ArrayView.createEntryEl(key, view.el, isPreview ? !isKeyNaN : isPreview);
  }
}
