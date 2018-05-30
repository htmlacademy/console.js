import TypeView from '../type-view';
import {getElement} from '../utils';
import {Mode, ViewType} from '../enums';

const EMPTY = `empty`;

export default class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this.rootView = this;
    }
    const proto = Object.getPrototypeOf(this._value);
    const stringTag = Object.prototype.toString.call(this._value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._protoConstructorName = proto && proto.hasOwnProperty(`constructor`) ? proto.constructor.name : `Array`;
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    <span class="length head__length hidden">${this._value.length}</span>\
    <div class="head__content entry-container entry-container--head entry-container--${this.viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  _afterRender() {
    this._lengthEl = this.el.querySelector(`.length`);
    this.toggleHeadContentBraced();
    if (this._stringTagName !== `Object`) {
      this._infoEl.textContent = this._stringTagName;
    } else {
      this._infoEl.textContent = this._protoConstructorName;
    }
    this._state = {};
    this._state.isOpeningDisabled = this._mode === Mode.PREVIEW;
    this._state.isShowInfo = this.isShowInfo;
    this._state.isHeadContentShowed = this.isShowHeadContent;
    this._state.isShowLength = this.isShowLength;

    if ((this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) &&
    !this._parentView) {
      this.toggleItalic(true);
    }
  }

  _getStateDescriptorsObject() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && self._headContentEl.childElementCount === 0) {
          const {fragment, isOversized} = self.createContent(self._value, true);
          self._state.isOversized = isOversized;
          self._headContentEl.appendChild(fragment);
        }
        self.toggleHeadContentShowed(bool);
      },
      set isShowLength(bool) {
        self.toggleContentLengthShowed(bool);
      },
      set isOpened(bool) {
        if (bool === self._isOpened) {
          return;
        }

        self._isOpened = bool;
        self.toggleArrowBottom(bool);
        self._state.isContentShowed = bool;
        if (self._mode === Mode.PROP && self._propKey !== `__proto__`) {
          self._state.isHeadContentShowed = !bool;
          self._state.isShowLength = bool || self._value.length > 1;
          self._state.isShowInfo = self.isShowInfo;
        }
      },
      get isOpened() {
        return self._isOpened;
      }
    };
  }

  toggleContentLengthShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._lengthEl, `hidden`, !isEnable);
  }

  get isShowInfo() {
    return this._mode === Mode.DIR ||
      this._mode === Mode.PREVIEW ||
      (this._mode === Mode.PROP && (this._state.isOpened || this._propKey === `__proto__`)) ||
      this._stringTagName !== `Array` || this._protoConstructorName !== `Array`;
  }

  get isShowHeadContent() {
    return !(this._mode === Mode.DIR ||
      this._mode === Mode.PREVIEW ||
      (this._mode === Mode.PROP && this._propKey === `__proto__`));
  }

  get isShowLength() {
    return this._mode === Mode.DIR ||
      this._mode === Mode.PREVIEW ||
      (this._mode === Mode.PROP && this._propKey === `__proto__`) ||
      this._value.length > 1;
  }

  createContent(arr, inHead) {
    const entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
    const fragment = document.createDocumentFragment();
    entriesKeys.delete(`length`); // Length property not displayed in head, exception
    let isOversized = false;
    let addedKeysCounter = 0;

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;

    for (let i = 0, l = arr.length; i < l; i++) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      const key = i.toString();
      let isIncrementCounter = this._console.params[this.viewType].countEntriesWithoutKeys;
      let entryEl = null;
      if (entriesKeys.has(key)) {
        entryEl = this._createTypedEntryEl({obj: arr, key: i, mode, withoutKey: inHead, notCheckDescriptors: true});
        entriesKeys.delete(key);
      } else if (inHead) {
        entryEl = this._createEntryEl({key: i, el: getElement(`<span class="grey">${EMPTY}</span>`), withoutKey: true});
      } else {
        isIncrementCounter = false;
      }

      TypeView.appendEntryElIntoFragment(entryEl, fragment);

      if (isIncrementCounter) {
        addedKeysCounter++;
      }
    }

    for (let key of entriesKeys) {
      if (inHead && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj: arr, key, mode, canReturnNull: inHead}),
          fragment
      );
      addedKeysCounter++;
    }
    if (!inHead) {
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj: arr, key: `length`, mode, notCheckDescriptors: true}),
          fragment
      );
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj: arr, key: `__proto__`, mode, notCheckDescriptors: true}),
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
