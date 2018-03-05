import TypeView from '../type-view';
import {createTypedView} from '../utils';
import {Mode, Class} from '../enums';

export default class ArrayView extends TypeView {
  constructor(arr, mode) {
    super(arr, `array`, false);
    this._mode = mode;
    this._elements = new Map();
    this._isOpened = false;
  }

  get template() {
    return `\
<div class="console__item console__item_array">
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <span class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}">${this.value.length}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS} entry-container entry-container_head"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container"></div>
</div>`;
  }

  bind() {
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    const headInfoEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    const headElementsEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    const headElementsLengthEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}`);
    const {isShowConstructor, isShowElements, isShowLength} = this._getHeadContent();
    if (isShowConstructor) {
      this._showHideConstructor(headInfoEl, true);
    }
    if (isShowElements) {
      headElementsEl.appendChild(this.createContent(this.value, true));
      this._showHideElements(headElementsEl, true);
    }
    if (isShowLength) {
      this._showHideLength(headElementsLengthEl, true);
    }
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    this._setHeadClickHandler(headEl);
  }

  _showHideConstructor(headInfoEl, isShow) {
    if (isShow) {
      headInfoEl.classList.add(Class.CONSOLE_ITEM_HEAD_SHOW);
    }
  }

  _showHideLength(headElementsLengthEl, isShow) {
    if (isShow) {
      headElementsLengthEl.classList.add(Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH_SHOW);
    }
  }

  _showHideElements(headElementsEl, isShow) {
    if (isShow) {
      headElementsEl.classList.add(Class.CONSOLE_ITEM_HEAD_ELEMENTS_SHOW);
    }
  }

  // _setHeadClickHandler(headEl) {
  //   headEl.addEventListener(`click`, () => {
  //     if (this._isOpened) {
  //       this._hideContent();
  //     } else {
  //       if (this._mode === Mode.PROP) {
  //         this._showHideConstructor(true);
  //         this._showHideLength(true);
  //         this._showHideElements(false);
  //       }
  //       this._showContent();
  //     }
  //     this._isOpened = !this._isOpened;
  //   });
  // }

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
      const view = createTypedView(value, isPreview ? Mode.PREVIEW : Mode.PROP);
      const entryEl = ArrayView.createEntryEl(key, view.el, isPreview ? !isKeyNaN : isPreview);
      // if (!isPreview) {
      //   this._elements.set(entryEl, view);
      // }
      fragment.appendChild(entryEl);
    }
    return fragment;
  }
}
