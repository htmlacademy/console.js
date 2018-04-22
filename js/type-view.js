/* eslint guard-for-in: "off"*/
import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Mode} from './enums';

export default class TypeView extends AbstractView {
  constructor(params, cons) {
    super();
    if (params.parentView) {
      this._parentView = params.parentView;
      this._rootView = params.parentView._rootView;
    }
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._propKey = params.propKey;
    this._currentDepth = typeof params.depth === `number` ? params.depth : 1;
  }

  afterRender() {}

  bind() {
    if (!this.viewType) {
      throw new Error(`this.viewType must be specified`);
    }
    if (!this._rootView) {
      throw new Error(`this._rootView must be specified`);
    }
    this._headEl = this.el.querySelector(`.head`);
    this._headContentEl = this.el.querySelector(`.head__content`);
    this._infoEl = this.el.querySelector(`.info`);
    this._contentEl = this.el.querySelector(`.item__content`);

    this.afterRender();
  }

  set state(params) {
    if (!this._state) {
      this._state = {};
      Object.defineProperties(
          this._state,
          Object.getOwnPropertyDescriptors(this._getStateCommonProxyObject())
      );
      Object.defineProperties(
          this._state,
          Object.getOwnPropertyDescriptors(this._getStateProxyObject())
      );
      Object.seal(this._state);
    }
    for (let key in params) {
      this._state[key] = params[key];
    }
  }

  get state() {
    return this._state;
  }

  /**
   * @abstract
   * @return {{}} if not overriden return object without descriptors
   */
  _getStateProxyObject() {
    return {};
  }

  _getStateCommonProxyObject() {
    const self = this;
    return {
      set isShowInfo(bool) {
        self.toggleInfoShowed(bool);
      },
      set isHeadContentShowed(bool) {
        self.toggleHeadContentShowed(bool);
      },
      set isOpeningDisabled(bool) {
        if (self._mode === Mode.PREVIEW || self._isOpeningDisabled === bool) {
          return;
        }
        self.togglePointer(!bool);
        self._addOrRemoveHeadClickHandler(!bool);
        self.state.isContentShowed = !bool && self._isAutoExpandNeeded;
        self._isOpeningDisabled = bool;
      },
      get isOpeningDisabled() {
        return self._isOpeningDisabled;
      },
      set isContentShowed(bool) {
        self.toggleArrowBottom(bool);
        self._isContentShowed = self.toggleContentShowed(bool);
        if (self._isContentShowed && self._contentEl.childElementCount === 0) {
          self._contentEl.appendChild(self.createContent(self.value, false).fragment);
        }
      },
      get isContentShowed() {
        return self._isContentShowed;
      },
      set isOversized(bool) {
        self.toggleHeadContentOversized(bool);
      },
    };
  }

  toggleHeadContentBraced(isEnable) {
    return TypeView.toggleMiddleware(this._headContentEl, `entry-container--braced`, isEnable);
  }

  toggleHeadContentOversized(isEnable) {
    return TypeView.toggleMiddleware(this._headContentEl, `entry-container--oversize`, isEnable);
  }

  toggleInfoShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._infoEl, `hidden`, !isEnable);
  }

  toggleHeadContentShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._headContentEl, `hidden`, !isEnable);
  }

  toggleContentShowed(isEnable) {
    return !TypeView.toggleMiddleware(this._contentEl, `hidden`, !isEnable);
  }

  toggleError(isEnable) {
    return TypeView.toggleMiddleware(this.el, Mode.ERROR, isEnable);
  }

  toggleItalic(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `italic`, isEnable);
  }

  togglePointer(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `item__head--pointer`, isEnable);
  }

  toggleArrowBottom(isEnable) {
    return TypeView.toggleMiddleware(this._headEl, `item__head--arrow-bottom`, isEnable);
  }

  get value() {
    return this._value;
  }

  get mode() {
    return this._mode;
  }

  get nextNestingLevel() {
    return this._currentDepth + 1;
  }

  /**
   * @param {boolean} inHead — is head entries
   * @return {Set}
   */
  _getEntriesKeys(inHead) {
    const obj = this.value;

    const ownPropertyNamesAndSymbols = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertySymbols(obj)); // Неперечисляемые свои
    const keys = new Set(ownPropertyNamesAndSymbols);

    if (!this.isShowNotOwn) {
      return keys;
    }

    for (let key in obj) {
      if (inHead && !obj.hasOwnProperty(key)) {
        continue;
      }
      keys.add(key);
    }

    return keys;
  }

  get headContentEntriesKeys() {
    if (!this._headEntriesKeys) {
      this._headEntriesKeys = this._getEntriesKeys(true);
    }
    return this._headEntriesKeys;
  }

  get contentEntriesKeys() {
    if (!this._entriesKeys) {
      this._entriesKeys = this._getEntriesKeys(false);
    }
    return this._entriesKeys;
  }

  get _isAutoExpandNeeded() {
    if (!this._isAutoExpandNeededProxied) {
      this._isAutoExpandNeededProxied = false;

      const typeParams = this._console.params[this._rootView.viewType];

      if (this._currentDepth > typeParams.expandDepth) {
        return this._isAutoExpandNeededProxied;
      }

      if (this._parentView) {
        if (!typeParams.exclude.includes(this.viewType) &&
        !typeParams.excludeProperties.includes(this._propKey) &&
        this._parentView._isAutoExpandNeeded) {
          this._isAutoExpandNeededProxied = true;
        }
      } else {
        const entriesKeysLength = this._getEntriesKeys(false).size;
        if (typeParams.maxFieldsToExpand >= entriesKeysLength &&
          entriesKeysLength >= typeParams.minFieldsToExpand) {
          this._isAutoExpandNeededProxied = true;
        }
      }
    }
    return this._isAutoExpandNeededProxied;
  }

  _additionHeadClickHandler() {}

  _headClickHandler(evt) {
    evt.preventDefault();
    this.toggleArrowBottom();
    this.state.isContentShowed = !this.state.isContentShowed;
    this._additionHeadClickHandler();
  }

  _addOrRemoveHeadClickHandler(bool) {
    if (!this._bindedHeadClickHandler) {
      this._bindedHeadClickHandler = this._headClickHandler.bind(this);
    }
    if (bool) {
      this._headEl.addEventListener(`click`, this._bindedHeadClickHandler);
    } else {
      this._headEl.removeEventListener(`click`, this._bindedHeadClickHandler);
    }
  }

  static createEntryEl(index, valueEl, withoutKey, keyElClass) {
    const entryEl = getElement(`\
<span class="entry-container__entry">\
  ${withoutKey ? `` : `<span class="entry-container__key ${keyElClass ? keyElClass : ``}">${index}</span>`}<span class="entry-container__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.entry-container__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }

  static toggleMiddleware(el, className, isEnable) {
    if (typeof isEnable === `undefined`) {
      return el.classList.toggle(className);
    }
    if (isEnable) {
      el.classList.add(className);
      return true;
    } else {
      el.classList.remove(className);
      return false;
    }
  }
}
