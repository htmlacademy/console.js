import AbstractView from './abstract-view';
import {getElement} from './utils';
import {Class} from './enums';

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
      let rootFieldsMoreThanNeed = false;
      if (this._parentView && this._parentView._isAutoExpandNeeded) {
        rootFieldsMoreThanNeed = true;
      } else if (Object.keys(this.value).length >= // Object.getOwnPropertyNames
      this._console.params[this._rootViewType].minFieldsToExpand) {
        rootFieldsMoreThanNeed = true;
      }
      if (this._viewType !== null &&
      this._currentDepth <= this._console.params[this._rootViewType].expandDepth &&
      rootFieldsMoreThanNeed &&
      !this._console.params[this._rootViewType].exclude.includes(this._viewType)) {
        this._isAutoExpandNeededProxied = true;
      }
    }
    return this._isAutoExpandNeededProxied;
  }

  _getHeadErrorContent() {
    return {
      elOrStr: this._value.toString(),
      isShowConstructor: false,
      isShowElements: true
    };
  }

  _toggleContent() {
    if (!this._proxiedContentEl) {
      this._proxiedContentEl = getElement(`<div class="item-content entry-container entry-container_type_${this._viewType}"></div>`);
      this._proxiedContentEl.appendChild(this.createContent(this.value, false).fragment);
      this._contentContainerEl.appendChild(this._proxiedContentEl);
    }
    this._contentContainerEl.classList.toggle(Class.CONSOLE_ITEM_CONTENT_CONTAINTER_SHOW);
  }

  _hideContent() {
    this._proxiedContentEl.style.display = `none`;
  }

  _additionHeadClickHandler() {}

  _setHeadClickHandler(headEl) {
    this._setCursorPointer();
    headEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._toggleContent();
      this._additionHeadClickHandler();
    });
  }

  _setCursorPointer() {
    this.el.classList.add(Class.CONSOLE_ITEM_POINTER);
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
