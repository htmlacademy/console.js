/* eslint guard-for-in: "off"*/
/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType, GET_STATE_DESCRIPTORS_KEY_NAME} from '../enums';
import {checkObjectisPrototype} from '../utils';

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

export default class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.OBJECT;
    this._viewTypeParams = this._console.params[this.viewType];
    if (!params.parentView) {
      this.rootView = this;
    }
    this._stateDescriptorsQueue.push(this[getStateDescriptorsKey]());
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden">${this.getHeadContent()}</div>\
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

    this._state.isOpened = this.isOpeningAllowed;
  }

  [getStateDescriptorsKey]() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && !self._headContentEl.innerHTML) {
          const {fragment, isOversized} = self.createContent(self.value, true);
          self.isEnableOversized = isOversized;
          self._headContentEl.appendChild(fragment);
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
      },
      set isOpened(bool) {
        if (bool === self._isOpened) {
          return;
        }

        self._isOpened = bool;
        self.toggleArrowBottom(bool);
        self._state.isContentShowed = bool;

        self._state.isHeadContentShowed = self.isShowHeadContent;
        self._state.isShowInfo = self.isShowInfo;
      },
      get isOpened() {
        return self._isOpened;
      }
    };
  }

  get isShowInfo() {
    if (this._mode === Mode.PREVIEW &&
      this.stringTagName === `Object` &&
      this.protoConstructorName === `Object`) {
      return false;
    }

    const objectIsInstance = this._console.checkInstanceOf(this._value, `Node`) ||
      this._console.checkInstanceOf(this._value, `Error`) ||
      this._console.checkInstanceOf(this._value, `Date`) ||
      this._console.checkInstanceOf(this._value, `RegExp`);

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return false;
    }

    if (this._mode === Mode.DIR) {
      return true;
    }

    if (this._mode !== Mode.PREVIEW && this._state.isOpened) {
      return true;
    }

    return this.stringTagName !== `Object` ||
      this.protoConstructorName !== `Object` ||
      this._propKey === `__proto__`;
  }

  get isShowBraces() {
    if (this._mode === Mode.DIR) {
      return false;
    }

    if (this._mode === Mode.PREVIEW) {
      return this.stringTagName === `Object` &&
        this.protoConstructorName === `Object`;
    }

    const objectIsInstance = this._console.checkInstanceOf(this._value, `Node`) ||
      this._console.checkInstanceOf(this._value, `Error`) ||
      this._console.checkInstanceOf(this._value, `Date`) ||
      this._console.checkInstanceOf(this._value, `RegExp`);

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return false;
    }

    return true;
  }

  get isShowHeadContent() {
    if (this._mode === Mode.PREVIEW &&
      this.stringTagName === `Object` &&
      this.protoConstructorName === `Object`) {
      return true;
    }

    const objectIsInstance = this._console.checkInstanceOf(this._value, `Node`) ||
      this._console.checkInstanceOf(this._value, `Error`) ||
      this._console.checkInstanceOf(this._value, `Date`) ||
      this._console.checkInstanceOf(this._value, `RegExp`);

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return true;
    }

    if (this._mode !== Mode.DIR && this._mode !== Mode.PREVIEW) {
      return !(this._propKey === `__proto__` || this._state.isOpened);
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

    const objectIsInstance = this._console.checkInstanceOf(this._value, `Error`) ||
      this._console.checkInstanceOf(this._value, `Date`) ||
      this._console.checkInstanceOf(this._value, `RegExp`);

    if (objectIsInstance && !checkObjectisPrototype(this._value)) {
      return true;
    }
    return false;
  }

  get isEnableItalic() {
    if (this._mode === Mode.LOG ||
    this._mode === Mode.LOG_HTML ||
    this._mode === Mode.ERROR) {
      const objectIsInstance = this._console.checkInstanceOf(this._value, `Node`) ||
        this._console.checkInstanceOf(this._value, `Error`) ||
        this._console.checkInstanceOf(this._value, `Date`);

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
    const objectIsInstance = this._console.checkInstanceOf(this._value, `Error`) ||
      this._console.checkInstanceOf(this._value, `Date`);

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
    return this.el.classList.toggle(`error`, isEnable);
  }

  get headContentClassName() {
    if (this._console.checkInstanceOf(this._value, `RegExp`) && this._mode !== Mode.DIR) {
      return `c-regexp`;
    }
    return null;
  }

  getHeadContent() {
    if (this._mode === Mode.PREVIEW &&
    this.stringTagName === `Object` &&
    this.protoConstructorName === `Object`) {
      return `…`;
    }
    if (!checkObjectisPrototype(this._value)) {
      // Что пишем, если у нас элемент, отнаследованный от Node
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName#Value
      // if (this._console.checkInstanceOf(this._value, `Node`)) {
      //   if (this._console.checkInstanceOf(this._value, `HTMLElement`)) {
      //     let str = this._value.tagName.toLowerCase();
      //     if (this._value.id) {
      //       str += `#${this._value.id}`;
      //     }
      //     if (this._value.classList.length) {
      //       str += `.` + Array.prototype.join.call(this._value.classList, `.`);
      //     }
      //     return str;
      //   } else {
      //     return this._value.nodeName;
      //   }
      // } else
      if (this._console.checkInstanceOf(this._value, `Error`)) {
        let str = this._value.name;
        if (this._value.message) {
          str += `: ${this._value.message}`;
        }
        return str;
      } else if (this._console.checkInstanceOf(this._value, `Date`)) {
        return this._value.toString();
      } else if (this._console.checkInstanceOf(this._value, `RegExp`)) {
        return `/${this._value.source}/${this._value.flags}`;
      }
    }
    return ``;
  }

  createContent(obj, inHead) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;

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
    if (!inHead && this._viewTypeParams.showGetters) {
      fragment.appendChild(this._createGettersEntriesFragment());
    }
    if (!inHead && Object.getPrototypeOf(obj) !== null && !this._viewTypeParams.removeProperties.includes(`__proto__`)) {
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj, key: `__proto__`, mode, notCheckDescriptors: true}),
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
