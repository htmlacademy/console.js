import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

export default class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }

    this._templateParams.withHeadContentlength = true;
  }

  afterRender() {
    const {isShowConstructor, isHeadContentShowed, isShowLength} = this._getHeadContent();
    this.toggleHeadContentBraced();
    if (isShowConstructor) {
      this._headInfoEl.textContent = this.value.constructor.name;
      this.toggleInfoShowed();
    }
    if (isHeadContentShowed) {
      this.toggleHeadContentShowed();
      this._headContentEl.appendChild(this.createContent(this.value, true).fragment);
    }
    if (isShowLength) {
      this.toggleContentLengthShowed();
    }
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler();
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP) {
      this.toggleInfoShowed();
      this.toggleHeadContentShowed();
    }
  }

  _getHeadContent() {
    let isShowConstructor = false;
    let isHeadContentShowed = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowConstructor = true;
      isHeadContentShowed = false;
    // } else if (this._mode === Mode.PROP) {
    } else if (this._mode === Mode.PREVIEW) {
      isShowConstructor = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.ERROR) {
      return this._getHeadErrorContent();
    }
    return {
      isShowConstructor,
      isHeadContentShowed,
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
    return ArrayView.createEntryEl(key.toString(), view.el, isPreview ? !isKeyNaN : isPreview);
  }
}
