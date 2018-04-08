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
    this.toggleHeadContentBraced();
    this._headInfoEl.textContent = this.value.constructor.name;
    this.state = this._getStateParams();

    if (this._mode === Mode.LOG || this._mode === Mode.ERROR && !this._parentView) {
      this.toggleItalic(true);
    }
    // if (this._mode === Mode.PREVIEW) {
    //   return;
    // }
    //
    // if (this._isAutoExpandNeeded) {
    //   this._toggleContent(true);
    // }
    // this._addOrRemoveHeadClickHandler(true);
  }

  _getStateProxyObject() {
    const self = this;
    return {
      set isShowConstructor(bool) {
        self.toggleInfoShowed(bool);
        return bool;
      },
      set isShowLength(bool) {
        self.toggleContentLengthShowed(bool);
        return bool;
      },
      set isHeadContentShowed(bool) {
        if (bool && self._headContentEl.childElementCount === 0) {
          self._headContentEl.appendChild(self.createContent(self.value, true).fragment);
        }
        self.toggleHeadContentShowed(bool);
      }
    };
  }

  _additionHeadClickHandler() {
    this.state = this._getStateParams();
  }

  _getStateParams() {
    let isShowConstructor = false;
    let isHeadContentShowed = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowConstructor = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PREVIEW) {
      isShowConstructor = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PROP) {
      isShowConstructor = true;
      isShowLength = true;
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
