import TypeView from '../type-view';
import {getElement} from '../utils';
import {Mode, ViewType} from '../enums';

const EMPTY = `empty`;

export default class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this._rootView = this;
    }

    this._templateParams.withHeadContentlength = true;
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <span class="length head__length hidden">${this.value.length}</span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  afterRender() {
    this._lengthEl = this.el.querySelector(`.length`);
    this.toggleHeadContentBraced();
    this._infoEl.textContent = this.value.constructor.name;
    this.state = this._getStateParams();

    if ((this._mode === Mode.LOG || this._mode === Mode.ERROR) && !this._parentView) {
      this.toggleItalic(true);
    }
  }

  _getStateProxyObject() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && self._headContentEl.childElementCount === 0) {
          self._headContentEl.appendChild(self.createContent(self.value, true).fragment);
        }
        self.toggleHeadContentShowed(bool);
      },
      set isShowLength(bool) {
        self.toggleContentLengthShowed(bool);
      }
    };
  }

  toggleContentLengthShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._lengthEl, `hidden`, !isEnable);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP && this._propKey !== `__proto__`) {
      this.state.isShowInfo = this._isContentShowed;
      this.state.isHeadContentShowed = !this._isContentShowed;
      this.state.isShowLength = this._isContentShowed || this.value.length > 1;
    }
  }

  _getStateParams() {
    let isShowInfo = false;
    let isHeadContentShowed = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowInfo = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PREVIEW) {
      isShowInfo = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PROP) {
      isShowInfo = false;
      isHeadContentShowed = true;

      if (this._propKey === `__proto__`) {
        isShowInfo = true;
        isHeadContentShowed = false;
        isShowLength = true;
      }
    }
    return {
      isShowInfo,
      isHeadContentShowed,
      isShowLength,
      isOpeningDisabled: false
    };
  }

  createContent(arr, inHead) {
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    const fragment = document.createDocumentFragment();
    entriesKeys.delete(`length`);

    for (let i = 0, l = arr.length; i < l; i++) {
      const key = i.toString();
      if (entriesKeys.has(key)) {
        fragment.appendChild(this._createArrayEntryEl(arr, key, inHead));
        entriesKeys.delete(key);
      } else if (inHead) {
        const entryEl = ArrayView.createEntryEl(key, getElement(`<span class="grey">${EMPTY}</span>`), inHead);
        fragment.appendChild(entryEl);
      }
    }
    for (let key of entriesKeys) {
      fragment.appendChild(this._createArrayEntryEl(arr, key, inHead));
    }
    if (!inHead) {
      fragment.appendChild(this._createArrayEntryEl(arr, `length`, inHead, `grey`));
      fragment.appendChild(this._createArrayEntryEl(arr, `__proto__`, inHead, `grey`));
    }
    return {fragment};
  }

  _createArrayEntryEl(arr, key, isPreview, keyElClass) {
    const val = arr[key];
    const isKeyNaN = Number.isNaN(Number.parseInt(key, 10));
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this, key);
    return ArrayView.createEntryEl(key.toString(), view.el, isPreview ? !isKeyNaN : isPreview, keyElClass);
  }
}
