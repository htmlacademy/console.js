/* eslint guard-for-in: "off"*/
import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Mode} from './enums';

const toggleMiddleware = (el, className, isEnable) => {
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
};

export default class TypeView extends AbstractView {
  constructor(params, cons) {
    super();
    if (params.parentView) {
      this._parentView = params.parentView;
      this._rootViewType = params.parentView._rootViewType;
    }
    this._viewType = null;
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._isOpened = false;
    this._currentDepth = typeof params.depth === `number` ? params.depth : 1;
    this._templateParams = {};
  }

//   get template() {
//     return `\
// <div class="console__item item item--${this._viewType}">\
//   <div class="item__head">\
//     <span class="item__head-info hidden"></span>\
//     ${this._templateParams.withHeadContentlength ? `<span class="item__head-content-length hidden">${this.value.length}</span>` : ``}\
//     <div class="item__head-content entry-container entry-container--head entry-container--${this._viewType} hidden"></div>\
//   </div>\
//   <div class="item__content entry-container entry-container--${this._viewType} hidden"></div>\
// </div>`;
//   }

  get template() {
    return `\
<div class="console__item item item--${this._viewType}">\
  <div class="head item__head">\
    <span class="info head__info hidden"></span>\
    ${this._templateParams.withHeadContentlength ? `<span class="length head__length hidden">${this.value.length}</span>` : ``}\
    <div class="head__content entry-container entry-container--head entry-container--${this._viewType} hidden"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this._viewType} hidden"></div>\
</div>`;
  }

  afterRender() {}

  bind() {
    this._headEl = this.el.querySelector(`.head`);
    this._headContentEl = this.el.querySelector(`.head__content`);
    this._infoEl = this.el.querySelector(`.info`);
    if (this._templateParams.withHeadContentlength) {
      this._lengthEl = this.el.querySelector(`.length`);
    }

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
      set isShowLength(bool) {
        self.toggleContentLengthShowed(bool);
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
      }
    };
  }

  toggleHeadContentBraced(isEnable) {
    return toggleMiddleware(this._headContentEl, `entry-container--braced`, isEnable);
  }

  toggleHeadContentOversized(isEnable) {
    return toggleMiddleware(this._headContentEl, `entry-container--oversize`, isEnable);
  }

  toggleInfoShowed(isEnable) {
    return !toggleMiddleware(this._infoEl, `hidden`, !isEnable);
  }

  toggleContentLengthShowed(isEnable) {
    return !toggleMiddleware(this._lengthEl, `hidden`, !isEnable);
  }

  toggleHeadContentShowed(isEnable) {
    return !toggleMiddleware(this._headContentEl, `hidden`, !isEnable);
  }

  toggleContentShowed(isEnable) {
    return !toggleMiddleware(this._contentEl, `hidden`, !isEnable);
  }

  toggleError(isEnable) {
    return toggleMiddleware(this.el, Mode.ERROR, isEnable);
  }

  toggleItalic(isEnable) {
    return toggleMiddleware(this._headEl, `italic`, isEnable);
  }

  togglePointer(isEnable) {
    return toggleMiddleware(this._headEl, `item__head--pointer`, isEnable);
  }

  toggleArrowBottom(isEnable) {
    return toggleMiddleware(this._headEl, `item__head--arrow-bottom`, isEnable);
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

  get _isAutoExpandNeeded() {
    if (!this._isAutoExpandNeededProxied) {
      this._isAutoExpandNeededProxied = false;

      if (this._viewType === null ||
        this._currentDepth > this._console.params[this._rootViewType].expandDepth) {
        return this._isAutoExpandNeededProxied;
      }

      let rootFieldsMoreThanNeed = false;
      if (this._parentView && this._parentView._isAutoExpandNeeded) {
        rootFieldsMoreThanNeed = true;
      } else if (Object.keys(this.value).length >= // Object.getOwnPropertyNames
      this._console.params[this._rootViewType].minFieldsToExpand) {
        rootFieldsMoreThanNeed = true;
      }

      if (rootFieldsMoreThanNeed &&
      !this._console.params[this._rootViewType].exclude.includes(this._viewType)) {
        this._isAutoExpandNeededProxied = true;
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

  static createEntryEl(index, valueEl, withoutKey) {
    const entryEl = getElement(`\
<span class="entry-container__entry">\
  ${withoutKey ? `` : `<span class="entry-container__key">${index}</span>`}<span class="entry-container__value-container"></span>\
</span>`);
    const valueContEl = entryEl.querySelector(`.entry-container__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }
}
