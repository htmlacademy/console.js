import AbstractView from './abstract-view';
import {Mode, GET_STATE_DESCRIPTORS_KEY_NAME} from './enums';

const DEFAULT_DEPTH = 1;

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

export default class BaseView extends AbstractView {
  constructor(params, cons) {
    super();
    if (params.parentView) {
      this._parentView = params.parentView;
      this.rootView = params.parentView.rootView;
    }
    this._viewTypeParams = void 0;
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._propKey = params.propKey;
    this._currentDepth = params.depth ? params.depth : DEFAULT_DEPTH;

    this._cache = {};

    this._stateDescriptorsQueue = [];
    this._stateDescriptorsQueue.push(this[getStateDescriptorsKey]());
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

  get protoConstructorName() {
    if (!this._cache.protoConstructorName) {
      const proto = Object.getPrototypeOf(this._value);
      this._cache.protoConstructorName = proto && proto.hasOwnProperty(`constructor`) ?
        proto.constructor.name : `Object`;
    }
    return this._cache.protoConstructorName;
  }

  get stringTagName() {
    if (!this._cache.stringTagName) {
      const stringTag = Object.prototype.toString.call(this._value);
      this._cache.stringTagName = stringTag.substring(8, stringTag.length - 1);
    }
    return this._cache.stringTagName;
  }

  set stringTagName(val) {
    if (!this._cache.stringTagName) {
      this._cache.stringTagName = val;
    }
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
  get _state() {
    if (!this._viewState) {
      this._viewState = {};
      this._stateDescriptorsQueue.forEach((descriptorsObj) => {

        Object.defineProperties(
            this._viewState,
            Object.getOwnPropertyDescriptors(descriptorsObj)
        );
      });
      Object.seal(this._viewState);
    }
    return this._viewState;
  }

  /**
   * @return {{}} — object that contains descriptors only
   */
  [getStateDescriptorsKey]() {
    const self = this;
    return {
      set isShowInfo(bool) {
        if (!self._infoEl) {
          return;
        }
        if (bool && !self._infoEl.textContent) {
          self._infoEl.textContent = self.info;
        }
        self._isShowInfo = self.toggleInfoShowed(bool);
      },
      get isShowInfo() {
        return self._isShowInfo;
      },
      set isHeadContentShowed(bool) {
        self.toggleHeadContentShowed(bool);
      },
      set isOpeningDisabled(bool) {
        if (!bool && self._mode === Mode.PREVIEW) {
          throw new Error(`Enabling opening object in preview mode is forbidden`);
        }
        if (self._isOpeningDisabled === bool) {
          return;
        }

        self.toggleArrowPointer(!bool);
        self._addOrRemoveHeadClickHandler(!bool);
        self._isOpeningDisabled = bool;
      },
      get isOpeningDisabled() {
        return self._isOpeningDisabled;
      },
      set isBraced(bool) {
        self.toggleHeadContentBraced(bool);
      },
      set isOpened(bool) {
        if (bool === self._isOpened) {
          return;
        }

        self._isOpened = bool;
        self.toggleArrowBottom(bool);
        self._state.isContentShowed = bool;
      },
      get isOpened() {
        return self._isOpened;
      },
      set isContentShowed(bool) {
        if (bool === self._isContentShowed) {
          return;
        }
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
      set isItalicEnabled(bool) {
        self._isItalicEnabled = self.toggleItalic(bool);
      },
      get isItalicEnabled() {
        return self._isItalicEnabled;
      }
    };
  }

  toggleHeadContentBraced(isEnable) {
    return this._headContentEl.classList.toggle(`entry-container--braced`, isEnable);
  }

  toggleHeadContentOversized(isEnable) {
    return this._headContentEl.classList.toggle(`entry-container--oversize`, isEnable);
  }

  toggleInfoShowed(isEnable) {
    return !this._infoEl.classList.toggle(`hidden`, !isEnable);
  }

  toggleHeadContentShowed(isEnable) {
    return !this._headContentEl.classList.toggle(`hidden`, !isEnable);
  }

  toggleContentShowed(isEnable) {
    return !this._contentEl.classList.toggle(`hidden`, !isEnable);
  }

  toggleItalic(isEnable) {
    return this._headEl.classList.toggle(`italic`, isEnable);
  }

  toggleArrowPointer(isEnable) {
    return this._headEl.classList.toggle(`item__head--arrow-pointer`, isEnable);
  }

  toggleArrowBottom(isEnable) {
    return this._headEl.classList.toggle(`item__head--arrow-bottom`, isEnable);
  }

  get isOpeningAllowed() {
    return this._mode !== Mode.PREVIEW &&
      !this._state.isOpeningDisabled &&
      this.isAutoExpandNeeded;
  }

  get depth() {
    if (!this._cache.depth) {
      this._cache.depth = this._parentView ? this._parentView.depth + 1 : 1;
    }
    return this._cache.depth;
  }

  get nextNestingLevel() {
    return this._currentDepth + 1;
  }

  /**
   * Check if autoexpand needed
   * Setter for force
   * @type {boolean}
   */
  get isAutoExpandNeeded() {
    if (!this._cache.isAutoExpandNeeded) {
      this._cache.isAutoExpandNeeded = false;

      const rootViewTypeParams = this._console.params[this.rootView.viewType];

      if (this._currentDepth > rootViewTypeParams.expandDepth) {
        return this._cache.isAutoExpandNeeded;
      }

      if (this._parentView) {
        if (!(this._parentView.isAutoExpandNeeded &&
        !rootViewTypeParams.excludeViewTypesFromAutoexpand.includes(this.viewType) &&
        !rootViewTypeParams.excludePropertiesFromAutoexpand.includes(this._propKey))) {
          return this._cache.isAutoExpandNeeded;
        }
      }
    }
    return this._cache.isAutoExpandNeeded;
  }

  set isAutoExpandNeeded(bool) {
    this._cache.isAutoExpandNeeded = bool;
  }

  _headClickHandler(evt) {
    evt.preventDefault();
    this._state.isOpened = !this._state.isOpened;
  }

  _addOrRemoveHeadClickHandler(bool) {
    if (bool) {
      if (!this._bindedHeadClickHandler) {
        this._bindedHeadClickHandler = this._headClickHandler.bind(this);
      }
      this._headEl.addEventListener(`click`, this._bindedHeadClickHandler);
    } else if (this._bindedHeadClickHandler) {
      this._headEl.removeEventListener(`click`, this._bindedHeadClickHandler);
    }
  }

  /**
   * @param {HTMLElement|null} entryEl
   * @param {DocumentFragment} fragment
   */
  static appendEntryElIntoFragment(entryEl, fragment) {
    if (entryEl !== null) {
      fragment.appendChild(entryEl);
    }
  }

  static prependEntryElIntoFragment(entryEl, fragment) {
    if (entryEl !== null) {
      fragment.insertBefore(entryEl, fragment.firstElementChild);
    }
  }
}
