/* eslint guard-for-in: "off"*/
/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

const checkObjectisPrototype = (obj) => {
  return obj && obj.hasOwnProperty(`constructor`) &&
    typeof obj.constructor === `function` &&
    obj.constructor.hasOwnProperty(`prototype`) &&
    typeof obj.constructor.prototype === `object` &&
    obj.constructor.prototype === obj;
};

export default class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this.rootView = this;
    }
    const proto = Object.getPrototypeOf(this._value);
    const stringTag = Object.prototype.toString.call(this._value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._protoConstructorName = proto && proto.hasOwnProperty(`constructor`) ? proto.constructor.name : `Object`;
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  _afterRender() {
    const {elOrStr, stateParams, headContentClassName} = this._getHeadContent();
    // this._headContent = elOrStr;

    if (headContentClassName) {
      this._headContentEl.classList.add(headContentClassName);
    }

    if (this._value[Symbol.toStringTag]) {
      this._infoEl.textContent = this._stringTagName;
    } else {
      this._infoEl.textContent = this._protoConstructorName;
    }
    this._state = stateParams;
    this._state.isShowInfo = this.isShowInfo;
    this._state.isBraced = this.isShowBraces;
    this._state.isHeadContentShowed = this.isShowHeadContent;
    this._state.isOpeningDisabled = this.isDisableOpening;
    this._state.isItalicEnabled = this.isEnableItalic;
    this._state.isErrorEnabled = this.isEnableError;
  }

  _getStateDescriptorsObject() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && !self._headContentEl.innerHTML) {
          if (self.headContent instanceof HTMLElement ||
            self.headContent instanceof DocumentFragment) {
            self._headContentEl.appendChild(self.headContent);
          } else {
            self._headContentEl.innerHTML = self.headContent;
          }
        }
        self.toggleHeadContentShowed(bool);
      },
      set isErrorEnabled(bool) {
        self._isErrorEnabled = self.toggleError(bool);
      },
      get isErrorEnabled() {
        return self._isErrorEnabled;
      }
    };
  }

  get isShowInfo() {
    if (this._mode === Mode.PREVIEW &&
      this._stringTagName === `Object` &&
      this._protoConstructorName === `Object`) {
      return false;
    }

    const objectIsInstance = this._value instanceof Node ||
      this._value instanceof Error ||
      this._value instanceof Date ||
      this._value instanceof RegExp;

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return false;
    }

    if (this._mode === Mode.DIR) {
      return true;
    }

    return this._stringTagName !== `Object` ||
      this._protoConstructorName !== `Object` ||
      this._propKey === `__proto__`;
  }

  get isShowBraces() {
    if (this._mode === Mode.DIR) {
      return false;
    }

    if (this._mode === Mode.PREVIEW) {
      return this._stringTagName === `Object` &&
        this._protoConstructorName === `Object`;
    }

    const objectIsInstance = this._value instanceof Node ||
      this._value instanceof Error ||
      this._value instanceof Date ||
      this._value instanceof RegExp;

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return false;
    }

    return true;
  }

  get isShowHeadContent() {
    if (this._mode === Mode.PREVIEW &&
      this._stringTagName === `Object` &&
      this._protoConstructorName === `Object`) {
      return true;
    }

    if (this._mode !== Mode.DIR && this._mode !== Mode.PREVIEW) {
      return this._propKey !== `__proto__`;
    }

    const objectIsInstance = this._value instanceof Error ||
      this._value instanceof Date ||
      this._value instanceof RegExp;

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return true;
    }
    return false;
  }

  get isDisableOpening() {
    if (this._mode === Mode.PREVIEW) {
      return true;
    }

    if (this._mode === Mode.DIR) {
      return false;
    }

    const objectIsInstance = this._value instanceof Error ||
      this._value instanceof Date ||
      this._value instanceof RegExp;

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return true;
    }
    return false;
  }

  get isEnableItalic() {
    if (this._mode === Mode.LOG ||
    this._mode === Mode.LOG_HTML ||
    this._mode === Mode.ERROR) {
      const objectIsInstance = this._value instanceof Node ||
        this._value instanceof Error ||
        this._value instanceof Date;

      if (!objectIsInstance && !checkObjectisPrototype(this._value)) {
        return true;
      }
    }
    return false;
  }

  get isEnableError() {
    if (this._mode !== Mode.ERROR) {
      return false;
    }
    const objectIsInstance = this._value instanceof Error ||
      this._value instanceof Date;

    return objectIsInstance && !checkObjectisPrototype(this._value);
  }

  toggleError(isEnable) {
    return TypeView.toggleMiddleware(this.el, `error`, isEnable);
  }

  get headContent() {
    if (this._mode === Mode.PREVIEW &&
    this._stringTagName === `Object` &&
    this._protoConstructorName === `Object`) {
      return `…`;
    }

    if (!this._value.hasOwnProperty(`constructor`)) {
      if (this._value instanceof Node) {
        if (this._value instanceof HTMLElement) {
          let str = this._value.tagName.toLowerCase();
          if (this._value.id) {
            str += `#${this._value.id}`;
          }
          if (this._value.classList.length) {
            str += `.` + Array.prototype.join.call(this._value.classList, `.`);
          }
          return str;
        } else {
          return this._value.nodeName;
        }
      } else if (this._value instanceof Error) {
        return `${this._value.name}: ${this._value.message}`;
      } else if (this._value instanceof Date) {
        return this._value.toString();
      } else if (this._value instanceof RegExp) {
        return `/${this._value.source}/${this._value.flags}`;
      } else if (this._value instanceof Number) {
        return this._console.createTypedView(Number.parseInt(this._value, 10), Mode.PREVIEW, this.nextNestingLevel, this).el;
      } else if (this._value instanceof String) {
        return this._console.createTypedView(this._value.toString(), Mode.PREVIEW, this.nextNestingLevel, this).el;
      }
    }
    return this.createContent(this._value, true).fragment;
  }

  _getHeadContent() {
    let obj;
    if (this._mode === Mode.DIR) {
      obj = this._getHeadDirContent();
    } else if (this._mode === Mode.LOG ||
      this._mode === Mode.LOG_HTML ||
      this._mode === Mode.PROP ||
      this._mode === Mode.ERROR) {
      obj = this._getHeadLogContent();
    } else if (this._mode === Mode.PREVIEW) {
      obj = this._getHeadPreviewContent();
    }
    return obj;
  }

  _getHeadPreviewContent() {
    if (this._stringTagName === `Object` && this._protoConstructorName === `Object`) {
      return {
        elOrStr: `…`,
        stateParams: {
          // isShowInfo: false,
          // isHeadContentShowed: true,
          // isBraced: true
        }
      };
    }
    return this._getHeadDirContent();
  }

  _getHeadLogContent() {
    let val;
    let isShowInfo = false;
    let isBraced = true;
    let isOpeningDisabled = false;
    let isOversized = false;
    let isStringified = false;
    let headContentClassName;

    if (this._value instanceof Node && !this._value.hasOwnProperty(`constructor`)) {
      return this._getHeadDirContent();
    // } else if (this._value instanceof Error) {
    //   isBraced = false;
    //   val = `<pre>${this._value.stack}</pre>`;
    //   isOpeningDisabled = true;
    //   isStringified = true;
    } else if (this._value instanceof Number) {
      const view = this._console.createTypedView(Number.parseInt(this._value, 10), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowInfo = true;
    } else if (this._value instanceof String) {
      const view = this._console.createTypedView(this._value.toString(), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowInfo = true;
    } else if (this._value instanceof Date) {
      val = this._value.toString();
      isStringified = true;
      isOpeningDisabled = true;
      isBraced = false;
    } else if (this._value instanceof RegExp) {
      val = `/${this._value.source}/${this._value.flags}`;
      headContentClassName = `regexp`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this._value, true);
      val = obj.fragment;
      isOversized = obj.isOversized;
      if (this._stringTagName !== `Object` ||
        this._protoConstructorName !== `Object` ||
        this._propKey === `__proto__`) {
        isShowInfo = true;
      }
    }
    return {
      elOrStr: val,
      headContentClassName,
      stateParams: {
        // isShowInfo,
        // isHeadContentShowed: this._propKey !== `__proto__`,
        // isBraced,
        // isOpeningDisabled,
        isOversized,
        isStringified
      }
    };
  }

  _getHeadDirContent() {
    let val;
    let isShowInfo = false;
    let isHeadContentShowed = true;
    let isBraced = false;
    if (this._value instanceof Node && !this._value.hasOwnProperty(`constructor`)) {
      if (this._value instanceof HTMLElement) {
        let str = this._value.tagName.toLowerCase();
        if (this._value.id) {
          str += `#${this._value.id}`;
        }
        if (this._value.classList.length) {
          str += `.` + Array.prototype.join.call(this._value.classList, `.`);
        }
        val = str;
      } else {
        val = this._value.nodeName;
      }
    } else if (this._value instanceof Date) {
      val = this._value.toString();
    } else if (this._value instanceof RegExp) {
      val = `/${this._value.source}/${this._value.flags}`;
    } else if (this._value instanceof Error) {
      val = this._value.toString();
    } else {
      isShowInfo = true;
      isHeadContentShowed = false;
    }
    return {
      elOrStr: val
    };
  }

  createContent(obj, inHead) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    let isOversized = false;
    let addedKeysCounter = 0;
    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    entriesKeys.delete(`__proto__`); // Object may not have prototype

    for (let key of entriesKeys) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({obj, key, mode, canReturnNull: inHead}), fragment);
      addedKeysCounter++;
    }
    if (!inHead) {
      fragment.appendChild(this._createGettersEntriesFragment());
    }
    if (!inHead && Object.getPrototypeOf(obj) !== null) {
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj, key: `__proto__`, mode, notCheckDescriptors: true}),
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
