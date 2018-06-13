/* eslint guard-for-in: "off"*/
/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';
import {checkObjectisPrototype} from '../utils';

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
    if (this.headContentClassName) {
      this._headContentEl.classList.add(this.headContentClassName);
    }

    this._state.isShowInfo = this.isShowInfo;
    this._state.isBraced = this.isShowBraces;
    this._state.isHeadContentShowed = this.isShowHeadContent;
    this._state.isOpeningDisabled = this.isDisableOpening;
    this._state.isItalicEnabled = this.isEnableItalic;
    this._state.isErrorEnabled = this.isEnableError;
    this._state.isOversized = this.isEnableOversized;
  }

  _getStateDescriptors() {
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
        self._isHeadContentShowed = self.toggleHeadContentShowed(bool);
      },
      get isHeadContentShowed() {
        return self._isHeadContentShowed;
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

    if (this._mode === Mode.DIR || this._mode === Mode.PROP) {
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

  set isEnableOversized(bool) {
    this._isEnableOversized = bool;
  }

  get isEnableOversized() {
    if (!this._isEnableOversized) {
      this.isEnableOversized = false;
    }
    return this._isEnableOversized;
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

    if (!Object.prototype.hasOwnProperty.call(this._value, `constructor`)) {
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
        let str = this._value.name;
        if (this._value.message) {
          str += `: ${this._value.message}`;
        }
        return str;
      } else if (this._value instanceof Date) {
        return this._value.toString();
      } else if (this._value instanceof RegExp) {
        return `/${this._value.source}/${this._value.flags}`;
      }
    }
    const obj = this.createContent(this._value, true);
    this._isEnableOversized = obj.isOversized;
    return obj.fragment;
  }

  get headContentClassName() {
    if (this._value instanceof RegExp && this._mode !== Mode.DIR) {
      return `regexp`;
    }
    return null;
  }

  createContent(obj, inHead) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    entriesKeys.delete(`__proto__`); // Object may not have prototype

    // if object has PrimtiveValue property (only Number and String)
    if ((obj instanceof String || obj instanceof Number) &&
    !checkObjectisPrototype(this._value)) {
      if (obj instanceof String) {
        const el = this._console.createTypedView(this._value.toString(), mode, this.nextNestingLevel, this).el;
        TypeView.appendEntryElIntoFragment(
            this._createEntryEl({key: `[[PrimtiveValue]]`, el, withoutKey: inHead, isGrey: true}),
            fragment
        );
        if (inHead && obj.length) {
          for (let i = 0; i < obj.length; i++) {
            entriesKeys.delete(i.toString());
          }
          entriesKeys.delete(`length`);
        }
      } else if (obj instanceof Number) {
        const el = this._console.createTypedView(Number.parseInt(this._value, 10), mode, this.nextNestingLevel, this).el;
        TypeView.appendEntryElIntoFragment(
            this._createEntryEl({key: `[[PrimtiveValue]]`, el, withoutKey: inHead, isGrey: true}),
            fragment
        );
      }
    }

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    let isOversized = false;
    let addedKeysCounter = 0;
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
