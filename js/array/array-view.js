import TypeView from '../type-view';
import MapEntryView from '../object/map-entry-view';
import {getElement} from '../utils';
import {Mode, ViewType} from '../enums';

const EMPTY = `empty`;
const MULTIPLY_SIGN = `&times;`;

export default class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this.rootView = this;
    }
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

    this._state.isBraced = true;
    this._state.isOpeningDisabled = this._mode === Mode.PREVIEW;
    this._state.isShowInfo = this.isShowInfo;
    this._state.isHeadContentShowed = this.isShowHeadContent;
    this._state.isShowLength = this.isShowLength;

    if ((this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) &&
    !this._parentView) {
      this.toggleItalic(true);
    }
  }

  _getStateDescriptors() {
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
    return !this._lengthEl.classList.toggle(`hidden`, !isEnable);
  }

  get info() {
    if (this._value[Symbol.toStringTag]) {
      return this._value[Symbol.toStringTag];
    } else if (this.stringTagName !== `Object` &&
    (this.stringTagName !== `Array` || this._value === this._console.params.global.Array.prototype)) {
      return this.stringTagName;
    } else {
      return this.protoConstructorName;
    }
  }

  get isShowInfo() {
    return this._mode === Mode.DIR ||
      this._mode === Mode.PREVIEW ||
      (this._mode === Mode.PROP && (this._state.isOpened || this._propKey === `__proto__`)) ||
      this.stringTagName !== `Array` || this.protoConstructorName !== `Array`;
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

    const countEntriesWithoutKeys = this._console.params[this.viewType].countEntriesWithoutKeys;

    let emptyCount = 0;
    for (let i = 0, l = arr.length; i < l; i++) {
      if (inHead && countEntriesWithoutKeys && addedKeysCounter === maxFieldsInHead) {
        isOversized = true;
        break;
      }
      const key = i.toString();
      const hasKey = entriesKeys.has(key);
      if (inHead && !hasKey) {
        emptyCount++;
      }
      if (inHead && emptyCount !== 0 && (hasKey || i === l - 1)) {
        TypeView.appendEntryElIntoFragment(
            this._createEntryEl({key, el: getElement(`<span class="grey">${EMPTY}${emptyCount > 1 ? ` ${MULTIPLY_SIGN} ${emptyCount}` : ``}</span>`), withoutKey: true}),
            fragment
        );
        if (inHead && countEntriesWithoutKeys) {
          addedKeysCounter++;
        }
        emptyCount = 0;
      }
      if (hasKey) {
        if (this._propKey === `[[Entries]]` && this._console.checkInstanceOf(this._parentView.value, `Map`)) {
          const pair = arr[i];
          const el = new MapEntryView({val: pair, mode, depth: this.nextNestingLevel, parentView: this, propKey: this._propKey}, this._console).el;
          this.isAutoExpandNeeded = true;
          TypeView.appendEntryElIntoFragment(
              this._createEntryEl({key, el, withoutKey: inHead}),
              fragment
          );
        } else {
          TypeView.appendEntryElIntoFragment(
              this._createTypedEntryEl({obj: arr, key, mode, withoutKey: inHead, notCheckDescriptors: true}),
              fragment
          );
        }
        entriesKeys.delete(key);
        if (inHead && countEntriesWithoutKeys) {
          addedKeysCounter++;
        }
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
      if (Object.getPrototypeOf(arr) !== null) {
        TypeView.appendEntryElIntoFragment(
            this._createTypedEntryEl({obj: arr, key: `__proto__`, mode, notCheckDescriptors: true}),
            fragment
        );
      }
    }
    return {fragment, isOversized};
  }
}
