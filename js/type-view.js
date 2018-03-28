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
    this._console = cons;
    this._value = params.val;
    this._mode = params.mode;
    this._type = params.type;
    this._isOpened = false;

    this._currentDepth = typeof params.depth === `number` ? params.depth : 1;

  }

  /**
   * Шаблон
   * @override
   **/
  get template() {
    this._markup = {
      headInfo: `<span class="item-head__info">${this.value.constructor.name}</span>`,
      headContentLength: `<span class="item-head__content-length">${this.value.length}</span>`,
      headContent: `<div class="item-head__content ${this._templateArgs.isBraced ? `entry-container_braced` : ``} entry-container entry-container_head entry-container_type_${this._viewType}"></div>`,
      content: `<div class="item__content entry-container ${this._templateArgs.isOversize} entry-container_type_${this._viewType}"></div>`
    };
    return `\
<div class="console__item item item_${this._viewType}">\
  <div class="item-head">\
    ${this._templateArgs.withHeadInfo ? this._markup.headInfo : ``}\
    ${this._templateArgs.withHeadContentLength ? this._markup.headContentLength : ``}\
    ${this._templateArgs.withHeadContent ? this._markup.headContent : ``}\
  </div>
  ${this._templateArgs.withContent ? this._markup.content : ``}
</div>`;
  }

  afterRender() {}

  bind() {
    this._headEl = this.el.querySelector(`.item-head`);
    this._headInfoEl = this._headEl.querySelector(`.item-head__info`);
    this._headContentEl = this._headEl.querySelector(`.item-head__content`);
    this._headContentLengthEl = this._headEl.querySelector(`.item-head__content-length`);
    this._contentEl = this.el.querySelector(`.item__content`);
    this.afterRender();
  }

  get headInfoEl() {
    if (!this._headInfoEl) {
      this._headInfoEl = this._headEl.appendChild(getElement(this._markup.headInfo));
    }
    return this._headInfoEl;
  }

  get headContentEl() {
    if (!this._headContentEl) {
      this._headContentEl = this._headEl.appendChild(getElement(this._markup.headContent));
    }
    return this._headContentEl;
  }

  get headContentLengthEl() {
    if (!this._headContentLengthEl) {
      this._headContentLengthEl = this._headEl.appendChild(getElement(this._markup.headContentLength));
    }
    return this._headContentLengthEl;
  }

  get contentEl() {
    if (!this._contentEl) {
      this._contentEl = this.el.appendChild(getElement(this._markup.content));
    }
    return this._contentEl;
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
    if (!this._contentEl) {
      this.contentEl.appendChild(this.createContent(this.value, false).fragment);
    }
    this.contentEl.classList.toggle(`item__content_show`);
  }

  _additionHeadClickHandler() {}

  setHeadClickHandler() {
    this._setCursorPointer();
    this._headEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._toggleContent();
      this._additionHeadClickHandler();
    });
  }

  _setCursorPointer() {
    this.el.classList.add(Class.ITEM_POINTER);
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
