/* eslint guard-for-in: "off"*/
/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

export default class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }
    const stringTag = Object.prototype.toString.call(this.value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._constructorName = this.value.constructor.name;
  }

  afterRender() {
    const {
      elOrStr,
      isShowConstructor,
      isHeadContentShowed,
      isBraced,
      isOpeningDisabled,
      isOversized,
      isStringified,
      headContentClassName
    } = this._getHeadContent();

    if (headContentClassName) {
      this._headContentEl.classList.add(headContentClassName);
    }
    if (isBraced) {
      this.toggleHeadContentBraced();
    }
    if (isOversized) {
      this.toggleHeadContentOversized();
    }

    if (this._constructorName === `Object` && this._stringTagName !== `Object`) {
      this._headInfoEl.textContent = this._stringTagName;
    } else {
      this._headInfoEl.textContent = this._constructorName;
    }
    if (isShowConstructor) {
      this.toggleInfoShowed();
    }

    if (isHeadContentShowed) {
      if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
        this._headContentEl.appendChild(elOrStr);
      } else {
        this._headContentEl.innerHTML = elOrStr;
      }
      this.toggleHeadContentShowed();
    }

    if (this._mode === Mode.ERROR && isStringified) {
      this.toggleError();
    }

    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (!isOpeningDisabled) {
      if (this._isAutoExpandNeeded) {
        this._toggleContent();
      }
      this._setHeadClickHandler();
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
    if (this._stringTagName === `Object`) {
      return {
        elOrStr: `...`,
        isShowConstructor: false,
        isHeadContentShowed: true,
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
    let isOversized = false;
    let isStringified = false;
    let headContentClassName;

    if (this.value instanceof HTMLElement && Object.getPrototypeOf(this.value).constructor !== HTMLElement) {
      return this._getHeadDirContent();
    } else if (this.value instanceof Error) {
      isBraced = false;
      val = this.value.toString();
      isStringified = true;
    } else if (this.value instanceof Number) {
      const view = this._console.createTypedView(Number.parseInt(this.value, 10), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof String) {
      const view = this._console.createTypedView(this.value.toString(), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
      isStringified = true;
      isBraced = false;
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
      headContentClassName = `regexp`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this.value, true);
      val = obj.fragment;
      isOversized = obj.isOversized;
      if (this._stringTagName !== `Object` || this._constructorName !== `Object`) {
        isShowConstructor = true;
      }
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isHeadContentShowed: true,
      isBraced,
      isOpeningDisabled,
      isOversized,
      isStringified,
      headContentClassName
    };
  }

  _getHeadDirContent() {
    let val;
    let isShowConstructor = false;
    let isHeadContentShowed = true;
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
      isHeadContentShowed = false;
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isHeadContentShowed,
      isBraced
    };
  }

  createContent(obj, isPreview) {
    const fragment = document.createDocumentFragment();
    const addedKeys = new Set();
    // TODO: Добавить счётчик, чтобы больше 5 значений не добавлялось
    for (let key in obj) {
      if (isPreview && !obj.hasOwnProperty(key)) { // Перечисляемые свои
        continue;
      }
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversized: true
        };
      }
      try {
        const val = obj[key];
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
        addedKeys.add(key);
      } catch (err) {}
    }
    const ownPropertyNamesAndSymbols = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
    for (let key of ownPropertyNamesAndSymbols) { // Неперечисляемые свои
      if (addedKeys.has(key)) {
        continue;
      }
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversized: true
        };
      }
      try {
        const val = obj[key];
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
        addedKeys.add(key);
      } catch (err) {}
    }
    return {
      fragment,
      isOversized: false
    };
  }

  _createObjectEntryEl(key, val, isPreview) {
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this);
    return ObjectView.createEntryEl(key.toString(), view.el);
  }
}
