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
    const stringTag = Object.prototype.toString.call(this._value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._constructorName = this._value.constructor ? this._value.constructor.name : null;
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
    this._infoEl.textContent = this._stringTagName;
    this._state = this._getStateParams();

    if ((this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) && !this._parentView) {
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
      }
    };
  }

  toggleContentLengthShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._lengthEl, `hidden`, !isEnable);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP && this._propKey !== `__proto__`) {
      this._state.isShowInfo = this._isContentShowed;
      this._state.isHeadContentShowed = !this._isContentShowed;
      this._state.isShowLength = this._isContentShowed || this._value.length > 1;
    }
  }

  _getStateParams() {
    let isShowInfo = false;
    let isHeadContentShowed = true;
    let isShowLength = this._value.length > 1;
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
    if (this._stringTagName !== `Array` ||
    this._constructorName !== `Array`) {
      isShowInfo = true;
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
