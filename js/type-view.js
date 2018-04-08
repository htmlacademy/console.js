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

  get template() {
    return `\
<div class="console__item item item--${this._viewType}">\
  <div class="item__head">\
    <span class="item__head-info"></span>\
    ${this._templateParams.withHeadContentlength ? `<span class="item__head-content-length">${this.value.length}</span>` : ``}\
    <div class="item__head-content entry-container entry-container--head entry-container--${this._viewType}"></div>\
  </div>\
  <div class="item__content entry-container entry-container--${this._viewType}"></div>\
</div>`;
  }

  afterRender() {}

  bind() {
    if (!this._templateParams.onlyWrapper) {
      this._headEl = this.el.querySelector(`.item__head`);
      this._headContentEl = this._headEl.querySelector(`.item__head-content`);
      this._headInfoEl = this._headEl.querySelector(`.item__head-info`);
      if (this._templateParams.withHeadContentlength) {
        this._headContentLengthEl = this._headEl.querySelector(`.item__head-content-length`);
      }

      this._contentEl = this.el.querySelector(`.item__content`);
    }
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
      if (this._viewType === `function`) {
        console.log(this._state);
      }
      Object.seal(this._state);
    }

    for (let key in this._state) {
      const paramValue = params[key];
      this._state[key] = typeof paramValue !== `undefined` ? paramValue : false;
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
      set isOpeningDisabled(bool) {
        if (self._mode === Mode.PREVIEW || self._isOpeningDisabled === bool) {
          return;
        }
        if (bool) {
          self._toggleContent(false);
          self._addOrRemoveHeadClickHandler(false);
        } else {
          if (self._isAutoExpandNeeded) {
            self._toggleContent(true);
          }
          self._addOrRemoveHeadClickHandler(true);
        }
        self._isOpeningDisabled = bool;
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
    return toggleMiddleware(this._headInfoEl, `item__head-info--show`, isEnable);
  }

  toggleContentLengthShowed(isEnable) {
    return toggleMiddleware(this._headContentLengthEl, `item__head-content-length--show`, isEnable);
  }

  toggleHeadContentShowed(isEnable) {
    return toggleMiddleware(this._headContentEl, `item__head-content--show`, isEnable);
  }

  toggleContentShowed(isEnable) {
    return toggleMiddleware(this.el, `item--show-content`, isEnable);
  }

  toggleError(isEnable) {
    return toggleMiddleware(this.el, Mode.ERROR, isEnable);
  }

  toggleItalic(isEnable) {
    return toggleMiddleware(this._headEl, `item__head--italic`, isEnable);
  }

  _toggleCursorPointer(isEnable) {
    return toggleMiddleware(this._headEl, `item__head--pointer`, isEnable);
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

  _toggleContent(bool) {
    const isShowed = this.toggleContentShowed(bool);
    if (isShowed && this._contentEl.childElementCount === 0) {
      this._contentEl.appendChild(this.createContent(this.value, false).fragment);
    }
  }

  _additionHeadClickHandler() {}

  _headClickHandler(evt) {
    evt.preventDefault();
    this._toggleContent();
    this._additionHeadClickHandler();
  }

  _addOrRemoveHeadClickHandler(bool) {
    this._toggleCursorPointer(bool);
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
