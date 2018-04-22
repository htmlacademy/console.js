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
          const {fragment, isOversized} = self.createContent(self.value, true);
          self.state.isOversized = isOversized;
          self._headContentEl.appendChild(fragment);
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
    let isOversized = false;
    let addedKeysCounter = 0;

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;

    for (let i = 0, l = arr.length; i < l; i++) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      const key = i.toString();
      if (entriesKeys.has(key)) {
        fragment.appendChild(this._createArrayEntryEl(arr, i, inHead));
        entriesKeys.delete(key);
        addedKeysCounter++;
      } else if (inHead) {
        const entryEl = ArrayView.createEntryEl(i, getElement(`<span class="grey">${EMPTY}</span>`), inHead);
        fragment.appendChild(entryEl);
        addedKeysCounter++;
      }
    }
    for (let key of entriesKeys) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      fragment.appendChild(this._createArrayEntryEl(arr, key, inHead));
      addedKeysCounter++;
    }
    if (!inHead) {
      fragment.appendChild(this._createArrayEntryEl(arr, `length`, inHead, `grey`));
      fragment.appendChild(this._createArrayEntryEl(arr, `__proto__`, inHead, `grey`));
    }
    return {fragment, isOversized};
  }

  _createArrayEntryEl(arr, key, isPreview, keyElClass) {
    const val = arr[key];
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this, key);
    return ArrayView.createEntryEl(key.toString(), view.el, isPreview ? Number.isInteger(key) : isPreview, keyElClass);
  }
}
