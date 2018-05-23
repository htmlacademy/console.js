/* eslint no-empty: "off"*/
/* eslint no-unused-vars: "off"*/
import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Mode, Env} from './enums';

// var a = {};
// Object.getPrototypeOf(Object.getOwnPropertyDescriptors(a.__proto__)) === Object.getOwnPropertyDescriptors(a.__proto__).__proto__

const isNativeFunction = (fn) => {
  return /{\s*\[native code\]\s*}/g.test(fn);
};

const getAllPropertyDescriptors = (objToGetDescriptors, descriptors = {}) => {
  if (objToGetDescriptors === null) {
    return descriptors;
  }
  return Object.assign(
      getAllPropertyDescriptors(
          Object.getPrototypeOf(objToGetDescriptors),
          Object.getOwnPropertyDescriptors(objToGetDescriptors)
      ),
      descriptors
  );
};

const getFirstProtoContainingObject = (typeView) => {
  if (typeView.parentView && typeView.propKey === `__proto__`) {
    return getFirstProtoContainingObject(typeView.parentView);
  }
  return typeView.value;
};

export default class TypeView extends AbstractView {
  constructor(params, cons) {
    super();
    if (params.parentView) {
      this._parentView = params.parentView;
      this.rootView = params.parentView.rootView;
    }
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._propKey = params.propKey;
    this._currentDepth = typeof params.depth === `number` ? params.depth : 1;

    this._cache = {};
  }

  /**
   * @abstract
   * @protected
   */
  _afterRender() {}

  _bind() {
    if (!this.viewType) {
      throw new Error(`this.viewType must be specified`);
    }
    if (!this.rootView) {
      throw new Error(`this.rootView must be specified`);
    }
    this._headEl = this.el.querySelector(`.head`);
    this._headContentEl = this.el.querySelector(`.head__content`);
    this._infoEl = this.el.querySelector(`.info`);
    this._contentEl = this.el.querySelector(`.item__content`);

    this._afterRender();
  }

  get value() {
    return this._value;
  }

  get propKey() {
    return this._propKey;
  }

  get parentView() {
    return this._parentView;
  }

  /**
   * Current state
   * @type {{}}
   * @param {{}} params — object with values which will be assigned throught setters
   */
  set _state(params) {
    if (!this._viewState) {
      this._viewState = {};
      Object.defineProperties(
          this._viewState,
          Object.getOwnPropertyDescriptors(this._getStateCommonDescriptorsObject())
      );
      Object.defineProperties(
          this._viewState,
          Object.getOwnPropertyDescriptors(this._getStateDescriptorsObject())
      );
      Object.seal(this._viewState);
    }
    for (let key in params) {
      if (this._viewState.hasOwnProperty(key)) {
        this._viewState[key] = params[key];
      }
    }
  }

  get _state() {
    return this._viewState;
  }

  /**
   * @abstract
   * @return {{}} if not overriden return object without descriptors
   */
  _getStateDescriptorsObject() {
    return {};
  }

  /**
   * @return {{}} — object that contains descriptors only
   */
  _getStateCommonDescriptorsObject() {
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
        self._state.isContentShowed = !bool && self.isAutoExpandNeeded;
        self._isOpeningDisabled = bool;
      },
      get isOpeningDisabled() {
        return self._isOpeningDisabled;
      },
      set isContentShowed(bool) {
        self.toggleArrowBottom(bool);
        self._isContentShowed = self.toggleContentShowed(bool);
        if (self._isContentShowed && self._contentEl.childElementCount === 0) {
          self._contentEl.appendChild(self.createContent(self._value, false).fragment);
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

  get nextNestingLevel() {
    return this._currentDepth + 1;
  }

  get _ownPropertySymbols() {
    if (!this._cache.ownPropertySymbols) {
      this._cache.ownPropertySymbols = Object.getOwnPropertySymbols(this._value);
    }
    return this._cache.ownPropertySymbols;
  }

  get _ownPropertyDescriptors() {
    if (!this._cache.ownPropertyDescriptors) {
      this._cache.ownPropertyDescriptors = Object.getOwnPropertyDescriptors(this._value);
    }
    return this._cache.ownPropertyDescriptors;
  }

  get _ownPropertyDescriptorsWithGetSet() {
    if (!this._cache.ownPropertyDescriptorsWithGetSet) {
      const descriptors = {};
      for (let key in this._ownPropertyDescriptors) {
        if (!Object.prototype.hasOwnProperty.call(this._ownPropertyDescriptors, key)) {
          continue;
        }
        const descriptor = this._ownPropertyDescriptors[key];
        if (descriptor.get || descriptor.set) {
          descriptors[key] = descriptor;
        }
      }
      this._cache.ownPropertyDescriptorsWithGetSet = descriptors;
    }
    return this._cache.ownPropertyDescriptorsWithGetSet;
  }

  get _ownPropertyDescriptorsWithGetSetLength() {
    if (!this._cache.ownPropertyDescriptorsWithGetSetLength) {
      let count = 0;
      for (let key in this._ownPropertyDescriptorsWithGetSet) {
        if (!Object.prototype.hasOwnProperty.call(this._ownPropertyDescriptorsWithGetSet, key)) {
          continue;
        }
        count++;
      }
      this._cache.ownPropertyDescriptorsWithGetSetLength = count;
    }
    return this._cache.ownPropertyDescriptorsWithGetSetLength;
  }

  get _allPropertyDescriptors() {
    if (!this._cache.allPropertyDescriptors) {
      this._cache.allPropertyDescriptors = getAllPropertyDescriptors(
          Object.getPrototypeOf(this._value),
          this._ownPropertyDescriptors
      );
    }
    return this._cache.allPropertyDescriptors;
  }

  get _allPropertyDescriptorsWithGetters() {
    if (!this._cache.allPropertyDescriptorsWithGetters) {
      const allPropertyDescriptors = getAllPropertyDescriptors(
          Object.getPrototypeOf(this._value),
          this._ownPropertyDescriptors
      );
      const allPropertyDescriptorsWithGetters = {};
      for (let key in allPropertyDescriptors) {
        if (!Object.prototype.hasOwnProperty.call(allPropertyDescriptors, key)) {
          continue;
        }
        const descriptor = allPropertyDescriptors[key];
        if (descriptor.get) {
          allPropertyDescriptorsWithGetters[key] = descriptor;
        }
      }
      this._cache.allPropertyDescriptorsWithGetters = allPropertyDescriptorsWithGetters;
    }
    return this._cache.allPropertyDescriptorsWithGetters;
  }

  get _categorizedSortedProperties() {
    if (!this._cache.categorizedProperties) {
      const ownPropertyDescriptors = this._ownPropertyDescriptors;
      const allPropertyDescriptors = this._allPropertyDescriptors;
      const allPropertyDescriptorsWithGetters = this._allPropertyDescriptorsWithGetters;
      const keys = Object.keys(allPropertyDescriptors);

      const enumerableProperties = []; // Перечисляемые свои и из цепочки прототипов с геттерами
      const notEnumerableProperties = []; // Неперечисляемые свои и из цепочки прототипов с геттерами
      keys.forEach((key) => {
        const descriptor = allPropertyDescriptors[key];
        if (Object.prototype.hasOwnProperty.call(ownPropertyDescriptors, key) || // cause Object.prototype has hasOwnProperty descriptor
        Object.prototype.hasOwnProperty.call(allPropertyDescriptorsWithGetters, key)) {
          if (descriptor.enumerable) {
            enumerableProperties.push(key);
          } else {
            notEnumerableProperties.push(key);
          }
        }
      });
      this._cache.categorizedProperties = {enumerableProperties, notEnumerableProperties};
    }
    return this._cache.categorizedProperties;
  }

  get _firstProtoContainingObject() {
    if (this._cache.firstProtoContainingObject === void 0) {
      if (this._propKey === `__proto__`) {
        // console.log(this._value, this._propKey, this.parentView);
        this._cache.firstProtoContainingObject = getFirstProtoContainingObject(this._parentView);
      } else {
        this._cache.firstProtoContainingObject = null;
      }
    }
    return this._cache.firstProtoContainingObject;
  }

  /**
   * @param {boolean} inHead — is head entries
   * @return {Set}
   */
  _getEntriesKeys(inHead) {
    const {enumerableProperties, notEnumerableProperties} = this._categorizedSortedProperties;
    if (!inHead) {
      enumerableProperties.sort(TypeView.compareProperties);
      notEnumerableProperties.sort(TypeView.compareProperties);
    }
    const symbols = this._ownPropertySymbols;

    const keys = new Set(enumerableProperties.concat(notEnumerableProperties).concat(symbols));

    const allPropertyDescriptorsWithGetters = this._allPropertyDescriptorsWithGetters;

    if (inHead) {
      for (let key in allPropertyDescriptorsWithGetters) {
        if (!Object.prototype.hasOwnProperty.call(allPropertyDescriptorsWithGetters, key)) {
          continue;
        }
        const descriptorGetter = allPropertyDescriptorsWithGetters[key].get;
        if (!isNativeFunction(descriptorGetter)) {
          keys.delete(key);
        }
      }
    }

    if (this._console.params.env === Env.TEST) {
      keys.delete(`should`);
    }

    return keys;
  }

  /**
   * Head content entries keys
   * @type {Set}
   */
  get headContentEntriesKeys() {
    if (!this._headEntriesKeys) {
      this._headEntriesKeys = this._getEntriesKeys(true);
    }
    return this._headEntriesKeys;
  }

  /**
   * Content entries keys
   * @type {Set}
   */
  get contentEntriesKeys() {
    if (!this._entriesKeys) {
      this._entriesKeys = this._getEntriesKeys(false);
    }
    return this._entriesKeys;
  }

  /**
   * Check if autoexpand needed
   * @type {boolean}
   */
  get isAutoExpandNeeded() {
    if (!this.isAutoExpandNeededProxied) {
      this.isAutoExpandNeededProxied = false;

      const typeParams = this._console.params[this.rootView.viewType];

      if (this._currentDepth > typeParams.expandDepth) {
        return this.isAutoExpandNeededProxied;
      }

      if (this._parentView) {
        if (!typeParams.exclude.includes(this.viewType) &&
        !typeParams.excludeProperties.includes(this._propKey) &&
        this._parentView.isAutoExpandNeeded) {
          this.isAutoExpandNeededProxied = true;
        }
      } else {
        let entriesKeysLength = this.contentEntriesKeys.size;
        if (typeParams.showGetters) {
          entriesKeysLength += this._ownPropertyDescriptorsWithGetSetLength;
        }
        if (typeParams.maxFieldsToExpand >= entriesKeysLength &&
          entriesKeysLength >= typeParams.minFieldsToExpand) {
          this.isAutoExpandNeededProxied = true;
        }
      }
    }
    return this.isAutoExpandNeededProxied;
  }

  _additionHeadClickHandler() {}

  _headClickHandler(evt) {
    evt.preventDefault();
    this.toggleArrowBottom();
    this._state.isContentShowed = !this._state.isContentShowed;
    this._additionHeadClickHandler();
  }

  _addOrRemoveHeadClickHandler(bool) {
    if (!this.__bindedHeadClickHandler) {
      this.__bindedHeadClickHandler = this._headClickHandler.bind(this);
    }
    if (bool) {
      this._headEl.addEventListener(`click`, this.__bindedHeadClickHandler);
    } else {
      this._headEl.removeEventListener(`click`, this.__bindedHeadClickHandler);
    }
  }

  _createGettersEntriesFragment() {
    const fragment = document.createDocumentFragment();
    const mode = Mode.PROP;

    const keys = Object.keys(this._ownPropertyDescriptorsWithGetSet);
    keys.sort(TypeView.compareProperties);

    if (this._console.params.env === Env.TEST) {
      const shouldKeyIndex = keys.indexOf(`should`);
      if (shouldKeyIndex !== -1) {
        keys.splice(shouldKeyIndex, 1);
      }
    }

    for (let key of keys) {
      const descriptor = this._ownPropertyDescriptorsWithGetSet[key];

      if (descriptor.get !== void 0) {
        const getterEl = this._console.createTypedView(descriptor.get, mode, this.nextNestingLevel, this, key).el;
        TypeView.appendEntryElIntoFragment(
            this._createEntryEl({key: `get ${key}`, el: getterEl, mode, isGrey: true}),
            fragment
        );
      }
      if (descriptor.set !== void 0) {
        const setterEl = this._console.createTypedView(descriptor.set, mode, this.nextNestingLevel, this, key).el;
        TypeView.appendEntryElIntoFragment(
            this._createEntryEl({key: `set ${key}`, el: setterEl, mode, isGrey: true}),
            fragment
        );
      }
    }
    return fragment;
  }

  /**
   * Create entry element
   * @protected
   * @param {{}} params
   * @param {string} params.key — key, index of array or field name
   * @param {HTMLSpanElement|undefined} params.el — HTML span element to append into container
   * @param {Mode} params.mode — log mode
   * @param {boolean} [params.withoutKey] — create entry without key element
   * @param {function} [params.getViewEl] — function to get element if so wasn't present while calling this method
   * @return {HTMLSpanElement}
   */
  _createEntryEl({key, el, mode, withoutKey, getViewEl, isGrey}) {
    const entryEl = getElement(`\
<span class="entry-container__entry">\
${withoutKey ? `` : `<span class="entry-container__key ${isGrey ? `grey` : ``}">${key.toString()}</span>`}<span class="entry-container__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.entry-container__value-container`);

    if (el) {
      valueContEl.appendChild(el);
    } else {
      valueContEl.textContent = `(...)`;
      valueContEl.classList.add(`entry-container__value-container--underscore`);
      const insertEl = () => {
        valueContEl.textContent = ``;
        valueContEl.classList.remove(`entry-container__value-container--underscore`);
        let viewEl;
        try {
          viewEl = getViewEl();
          valueContEl.appendChild(viewEl);
        } catch (err) {
          valueContEl.textContent = `[Exception: ${err.stack}]`;
        }
        valueContEl.removeEventListener(`click`, insertEl);
      };
      valueContEl.addEventListener(`click`, insertEl);
    }

    return entryEl;
  }

  /**
   * Create typed entry element
   * @protected
   * @param {{}} params
   * @param {{}} params.obj — object/array/fn
   * @param {string} params.key — key, index of array or field name
   * @param {Mode} params.mode — log mode
   * @param {boolean} [params.withoutKey] — create entry without key element
   * @return {HTMLSpanElement}
   */
  _createTypedEntryEl({obj, key, mode, withoutKey, notCheckDescriptors, canReturnNull = false}) {
    const {notEnumerableProperties} = this._categorizedSortedProperties;
    let isGrey = false;
    if (mode !== Mode.PREVIEW &&
      (notEnumerableProperties.indexOf(key) !== -1 ||
      this._ownPropertySymbols.indexOf(key) !== -1 ||
      key === `__proto__`)) {
      isGrey = true;
    }
    // if obj is __proto__ or prototype property and has property descriptor with getter for the key
    const isProtoChainCall = this._propKey === `__proto__` &&
      Object.prototype.hasOwnProperty.call(this._allPropertyDescriptorsWithGetters, key);
    const getViewEl = () => {
      let val;
      if (isProtoChainCall) {
        val = this._allPropertyDescriptorsWithGetters[key].get.call(this._firstProtoContainingObject);
      } else {
        val = key === `__proto__` ? Object.getPrototypeOf(obj) : obj[key];
      }
      return this._console.createTypedView(val, mode, this.nextNestingLevel, this, key).el;
    };
    let el;
    try {
      if (notCheckDescriptors) {
        el = getViewEl();
      } else {
        const descriptors = this._allPropertyDescriptorsWithGetters;
        if (!isProtoChainCall && (
          !Object.prototype.hasOwnProperty.call(descriptors, key) ||
          isNativeFunction(descriptors[key].get) ||
          !descriptors[key].get ||
          key === `__proto__`)
        ) {
          el = getViewEl();
        }
      }
    } catch (err) {
      if (canReturnNull) {
        return null;
      }
    }
    return this._createEntryEl({key, el, mode, withoutKey, getViewEl, isGrey});
  }

  /**
   * @param {HTMLSpanElement|null} entryEl
   * @param {DocumentFragment} fragment
   */
  static appendEntryElIntoFragment(entryEl, fragment) {
    if (entryEl !== null) {
      fragment.appendChild(entryEl);
    }
  }

  /**
   * Toggle CSS class on element
   * If isEnable not present just toggle, otherwise add or remove
   * @static
   * @param {HTMLElement} el — element to toggle CSS class
   * @param {string} className — CSS class
   * @param {boolean|undefined} isEnable — add/remove if present, otherwise toggle
   * @return {boolean} — added — true, removed — false
   */
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

  static compareProperties(a, b) {
    if (a === b) {
      return 0;
    }
    const chunk = /^\d+|^\D+/;
    let chunka;
    let chunkb;
    let anum;
    let bnum;
    let diff = 0;
    while (diff === 0) {
      if (!a && b) {
        return -1;
      }
      if (!b && a) {
        return 1;
      }
      chunka = a.match(chunk)[0];
      chunkb = b.match(chunk)[0];
      anum = !isNaN(chunka);
      bnum = !isNaN(chunkb);
      if (anum && !bnum) {
        return -1;
      }
      if (bnum && !anum) {
        return 1;
      }
      if (anum && bnum) {
        diff = chunka - chunkb;
        if (diff === 0 && chunka.length !== chunkb.length) {
          if (!+chunka && !+chunkb) {
            return chunka.length - chunkb.length;
          } else {
            return chunkb.length - chunka.length;
          }
        }
      } else if (chunka !== chunkb) {
        return chunka < chunkb ? -1 : 1;
      }
      a = a.substring(chunka.length);
      b = b.substring(chunkb.length);
    }
    return diff;
  }
}
