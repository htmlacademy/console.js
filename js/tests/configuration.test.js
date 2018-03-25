(function () {
'use strict';

const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};

class AbstractView {
  constructor() {}

  /**
   * @abstract
   * @return {string}
   */
  get template() {}

  get el() {
    if (!this._el) {
      this._el = this.render();
      this.bind(this._el);
    }
    return this._el;
  }

  render() {
    return getElement(this.template);
  }

  bind() {}
}

const Mode = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  PROP: `prop`,
  ERROR: `error`
};

const ViewType = {
  FUNCTION: `function`,
  OBJECT: `object`,
  ARRAY: `array`,
  PRIMITIVE: `primitive`
};

const Class = {
  CONSOLE_ITEM_HEAD: `item-head`,
  CONSOLE_ITEM_POINTER: `item_pointer`,
  CONSOLE_ITEM_HEAD_SHOW: `item-head_show`,
  ENTRY_CONTAINER_BRACED: `entry-container_braced`,
  ENTRY_CONTAINER_OVERSIZE: `entry-container_oversize`,
  CONSOLE_ITEM_HEAD_PARENTHESED: `item-head_parenthesed`,
  CONSOLE_ITEM_HEAD_INFO: `item-head-info`,
  CONSOLE_ITEM_HEAD_ELEMENTS: `item-head-elements`,
  CONSOLE_ITEM_HEAD_ELEMENTS_SHOW: `item-head-elements_show`,
  CONSOLE_ITEM_CONTENT_CONTAINTER: `item-content-container`,
  CONSOLE_ITEM_CONTENT_CONTAINTER_SHOW: `item-content-container_show`,
  CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH: `item-head-elements-length`,
  CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH_SHOW: `item-head-elements-length_show`
};

class TypeView extends AbstractView {
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

/* eslint guard-for-in: "off"*/
// import {createTypedView} from '../utils';
class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    if (!params.parentView) {
      this._rootViewType = ViewType.OBJECT;
    }
    this._viewType = ViewType.OBJECT;
    this._entries = new Map();
    this._isOpened = false;
  }

  /**
   * Шаблон
   * @override
   * Чтобы окружить фигурными скобками тело объекта, добавьте к элемену с классом
   * Class.CONSOLE_ITEM_CONTENT_CONTAINTER
   * класс
   * Class.ENTRY_CONTAINER_BRACED
   *
   **/
  get template() {
    return `\
<div class="console__item item item_object">\
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS} entry-container entry-container_head entry-container_type_object"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>
</div>`;
  }

  bind() {
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    const headElementsEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    const headInfoEl = headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);

    const {elOrStr, isShowConstructor, isShowElements, isBraced, isOpeningDisabled, isOversize, isStringified} = this._getHeadContent();
    if (isBraced) {
      headElementsEl.classList.add(Class.ENTRY_CONTAINER_BRACED);
    }
    if (isOversize) {
      headElementsEl.classList.add(Class.ENTRY_CONTAINER_OVERSIZE);
    }
    if (isShowConstructor) {
      headInfoEl.classList.add(Class.CONSOLE_ITEM_HEAD_SHOW);
    }
    if (isShowElements) {
      if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
        headElementsEl.appendChild(elOrStr);
      } else {
        headElementsEl.innerHTML = elOrStr;
      }
      headElementsEl.classList.add(Class.CONSOLE_ITEM_HEAD_ELEMENTS_SHOW);
    }

    if (this._mode === Mode.ERROR && isStringified) {
      this.el.classList.add(this._mode);
    }

    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (!isOpeningDisabled) {
      if (this._isAutoExpandNeeded) {
        this._toggleContent();
      }
      this._setHeadClickHandler(headEl);
    }
  }

  _getHeadContent() {
    if (this._mode === Mode.DIR) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode.LOG || this._mode === Mode.PROP || this._mode === Mode.ERROR) {
      return this._getHeadLogContent();
    } else if (this._mode === Mode.PREVIEW) {
      return this._getHeadPreviewContent();
    }
    return ``;
  }

  _getHeadPreviewContent() {
    if (Object.prototype.toString.call(this.value) === `[object Object]`) {
      return {
        elOrStr: `...`,
        isShowConstructor: false,
        isShowElements: true,
        isBraced: true
      };
    }
    return this._getHeadDirContent();
  }

  _getHeadLogContent() {
    let val;
    let isShowConstructor = false;
    let isBraced = true;
    let isOpeningDisabled = false;
    let isOversize = false;
    let isStringified = false;

    if (this.value instanceof HTMLElement) {
      return this._getHeadDirContent();
    } else if (this.value instanceof Error) {
      isBraced = false;
      val = this.value.toString();
      isStringified = true;
    } else if (this.value instanceof Number) {
      const view = this._console.createTypedView(Number.parseInt(this.value, 10), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof String) {
      const view = this._console.createTypedView(this.value.toString(), Mode.PREVIEW, this.nextNestingLevel, this);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
      isStringified = true;
      isBraced = false;
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this.value, true);
      val = obj.fragment;
      isOversize = obj.isOversize;
      if (this.value.constructor !== Object) {
        isShowConstructor = true;
      }
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isShowElements: true,
      isBraced,
      isOpeningDisabled,
      isOversize,
      isStringified
    };
  }

  _getHeadDirContent() {
    let val;
    let isShowConstructor = false;
    let isShowElements = true;
    let isBraced = false;
    if (this.value instanceof HTMLElement) {
      let str = this.value.tagName.toLowerCase();
      str += this.value.id;
      if (this.value.classList.length) {
        str += `.` + Array.prototype.join.call(this.value.classList, `.`);
      }
      val = str;
    } else if (this.value instanceof Date) {
      val = this.value.toString();
    } else if (this.value instanceof RegExp) {
      val = `/${this.value.source}/${this.value.flags}`;
    } else if (this.value instanceof Error) {
      val = this.value.toString();
    } else {
      val = this.value;
      isShowConstructor = true;
      isShowElements = false;
    }
    // else if (this.value.constructor === GeneratorFunction) {
    //   return this
    // }
    return {
      elOrStr: val,
      isShowConstructor,
      isShowElements,
      isBraced
    };
  }

  createContent(obj, isPreview) {
    const fragment = document.createDocumentFragment();
    const keys = Object.keys(obj);
    const addedKeys = new Set();
    // TODO: Добавить счётчик, чтобы больше 5 значений не добавлялось
    for (let key of keys) {
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversize: true
        };
      }
      addedKeys.add(key);
      const val = obj[key];
      try {
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
      } catch (err) {}
    }
    for (let key of Object.getOwnPropertyNames(obj)) {
      if (addedKeys.has(key)) {
        continue;
      }
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversize: true
        };
      }
      addedKeys.add(key);
      const val = obj[key];
      try {
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
      } catch (err) {}
    }
    return {
      fragment,
      isOversize: false
    };
  }

  _createObjectEntryEl(key, val, isPreview) {
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this);
    return ObjectView.createEntryEl(key, view.el);
  }
}

// import {createTypedView} from '../utils';
class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    if (!params.parentView) {
      this._rootViewType = ViewType.ARRAY;
    }
    this._viewType = ViewType.ARRAY;
    this._elements = new Map();
    this._isOpened = false;
  }

  /**
   * Шаблон
   * @override
   * Чтобы окружить квадратными скобками тело объекта, добавьте к элемену с классом
   * Class.CONSOLE_ITEM_CONTENT_CONTAINTER
   * класс
   * Class.ENTRY_CONTAINER_BRACED
   *
   **/
  get template() {
    return `\
<div class="console__item item item_array">
  <div class="${Class.CONSOLE_ITEM_HEAD}">
    <span class="${Class.CONSOLE_ITEM_HEAD_INFO}">${this.value.constructor.name}</span>
    <span class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}">${this.value.length}</span>
    <div class="${Class.CONSOLE_ITEM_HEAD_ELEMENTS} entry-container entry-container_head entry-container_braced entry-container_type_array"></div>
  </div>
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>
</div>`;
  }

  bind() {
    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    this.headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    this.headInfoEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_INFO}`);
    this.headElementsEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS}`);
    this.headElementsLengthEl = this.headEl.querySelector(`.${Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH}`);
    const {isShowConstructor, isShowElements, isShowLength} = this._getHeadContent();
    if (isShowConstructor) {
      this._toggleConstructor(this.headInfoEl, true);
    }
    if (isShowElements) {
      this.headElementsEl.appendChild(this.createContent(this.value, true).fragment);
      this._toggleHeadElements(this.headElementsEl, true);
    }
    if (isShowLength) {
      this._toggleLength(this.headElementsLengthEl, true);
    }
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler(this.headEl);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP) {
      this._toggleConstructor();
      this._toggleHeadElements();
    }
  }

  _toggleConstructor() {
    this.headInfoEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_SHOW);
  }

  _toggleLength() {
    this.headElementsLengthEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH_SHOW);
  }

  _toggleHeadElements() {
    this.headElementsEl.classList.toggle(Class.CONSOLE_ITEM_HEAD_ELEMENTS_SHOW);
  }

  _getHeadContent() {
    let isShowConstructor = false;
    let isShowElements = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowConstructor = true;
      isShowElements = false;
    // } else if (this._mode === Mode.PROP) {
    } else if (this._mode === Mode.PREVIEW) {
      isShowConstructor = true;
      isShowElements = false;
      isShowLength = true;
    } else if (this._mode === Mode.ERROR) {
      return this._getHeadErrorContent();
    }
    return {
      isShowConstructor,
      isShowElements,
      isShowLength
    };
  }

  createContent(arr, isPreview) {
    const keys = Object.keys(arr);
    const addedKeys = new Set();
    const fragment = document.createDocumentFragment();
    for (let key of keys) {
      addedKeys.add(key);
      const val = arr[key];
      fragment.appendChild(this._createArrayEntryEl(key, val, isPreview));
    }
    for (let key of Object.getOwnPropertyNames(arr)) {
      if (addedKeys.has(key)) {
        continue;
      }
      if (isPreview && keys.indexOf(key) === -1) {
        continue;
      }
      const val = arr[key];
      fragment.appendChild(this._createArrayEntryEl(key, val, isPreview));
    }
    return {fragment};
  }

  _createArrayEntryEl(key, val, isPreview) {
    const isKeyNaN = Number.isNaN(Number.parseInt(key, 10));
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this);
    return ArrayView.createEntryEl(key, view.el, isPreview ? !isKeyNaN : isPreview);
  }
}

const MAX_PREVIEW_FN_BODY_LENGTH = 43;

const FnType = {
  PLAIN: `plain`,
  ARROW: `arrow`,
  CLASS: `class`
};

// arguments, caller, length, name, prototype, __proto__, [[FunctionLocation]], [[Scopes]]

// if .caller not accessed — не выводим
// if prototype undefined — не выводим
// name — если неименованная — получает имя переменной, в которую записана
// если именнованная — то имя ф-ии

class FunctionView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    if (!params.parentView) {
      this._rootViewType = ViewType.FUNCTION;
    }
    this._viewType = ViewType.FUNCTION;
    this._isOpened = false;
    this._fnType = FunctionView.checkFnType(this.value);
  }

  get template() {
    let tpl = `<div class="console__item item item_function ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">`;
    switch (this._mode) {
      case Mode.PREVIEW:
        tpl += `f`;
        break;
      case Mode.PROP:
        tpl += `\
<div class="${Class.CONSOLE_ITEM_HEAD}">${this._getHeadPropMarkup()}</div>\
<div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container"></div>`;
        break;
      case Mode.DIR:
        tpl += `\
<div class="${Class.CONSOLE_ITEM_HEAD}">${this._getHeadDirMarkup()}</div>\
<div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container"></div>`;
        break;
      case Mode.LOG:
      case Mode.ERROR:
        tpl += this._getLogMarkup();
        break;
    }
    tpl += `</div>`;
    return tpl;
  }

  bind() {
    if (this._mode !== Mode.DIR && this._mode !== Mode.PROP) {
      return;
    }

    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    // previewEl.appendChild(this.createPreview(this.value, true));
    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler(headEl);
  }

  _getHeadPropMarkup() {
    const {name, params, lines} = this.parseFunction(this.value);
    const joinedLines = lines.join(`\n`);

    let markup = `\
<span>\
${this._fnType === FnType.CLASS ? `class ` : ``}\
${this._fnType === FnType.PLAIN ? `f ` : ``}\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType !== FnType.CLASS) {
      markup += `{${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `...`}}`;
    }
    markup += `</span>`;
    return markup;
  }

  _getHeadDirMarkup() {
    const {name, params} = this.parseFunction(this.value);

    let markup = `\
  <span>\
  ${this._fnType === FnType.CLASS ? `class ` : ``}\
  ${this._fnType === FnType.PLAIN ? `f ` : ``}\
  ${name ? name : ``}\
  ${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}</span>`;
    return markup;
  }

  _getLogMarkup() {
    return `<pre>${this.value.toString()}</pre>`;
    // const {name, params, lines} = this.parseFunction(this.value);
    /* return `\
<pre>\
${this._fnType === FnType.CLASS ? `class ` : ``}\
${this._fnType === FnType.PLAIN ? `function ` : ``}\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}{
${lines.join(`\n`)}
}
</pre>`;*/
  }

  static checkFnType(fn) {
    let str = fn.toString();
    const firstParenthesisIndex = str.indexOf(`(`);

    const classIndex = str.indexOf(`class`);
    const arrowIndex = str.indexOf(`=>`);
    if (classIndex !== -1 && classIndex < firstParenthesisIndex) {
      return FnType.CLASS;
    } else if (arrowIndex !== -1 && arrowIndex > firstParenthesisIndex) {
      return FnType.ARROW;
    }
    return FnType.PLAIN;
  }

  parseParams(funString) {
    const paramsStart = funString.indexOf(`(`);
    const paramsEnd = funString.indexOf(`)`);

    const paramsContent = funString.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  parseName(funString) {
    let endingChar;
    if (this._fnType === FnType.CLASS) {
      endingChar = `{`;
    } else if (this._fnType === FnType.PLAIN) {
      endingChar = `(`;
    }
    let name;
    const re = new RegExp(`(?:class|function)\\s+(\\w+)\\s*(?:\\${endingChar})`);
    const ex = re.exec(funString);
    if (ex !== null) {
      name = ex[1];
    }
    return name;
  }

  parseBody(funString) {
    const bodyStart = funString.indexOf(`{`);
    const bodyEnd = funString.lastIndexOf(`}`);

    const bodyContent = funString.substring(bodyStart + 1, bodyEnd).trim();

    if (!bodyContent) {
      return [];
    }

    return bodyContent.split(`\n`).map(function (it) {
      return it.trim();
    });
  }

  parseFunction(fnOrString) {
    let str;
    if (typeof fnOrString !== `string`) {
      str = fnOrString.toString();
    }
    return {
      name: fnOrString.name, // this.parseName(str),
      params: this.parseParams(str),
      lines: this.parseBody(str)
    };
  }

  createContent(fn) {
    const fragment = document.createDocumentFragment();
    const fnKeys = [`name`, `prototype`, `caller`, `arguments`, `length`, `__proto__`];
    const keys = Object.keys(fn).concat(fnKeys);
    for (let key of keys) {
      let value;
      try {
        const tempValue = fn[key];
        if (typeof tempValue !== `undefined`) {
          value = tempValue;
        } else {
          continue;
        }
      } catch (err) {
        continue;
      }
      const view = this._console.createTypedView(value, Mode.PROP, this.nextNestingLevel, this);
      const entryEl = FunctionView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return {fragment};
  }
}

const STRING_COLLAPSED = `string_collapsed`;

class PrimitiveView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.PRIMITIVE;
  }

  get template() {
    const type = this._type;
    let value = this.value;
    let html = ``;
    if (type === `string` || type === `symbol`) {
      if (type === `symbol`) {
        value = value.toString();
      }
      value = this.escapeHtml(value);
    }
    switch (type) {
      case `undefined`:
      case `null`:
      case `boolean`:
        html = `<div class="console__item item item_primitive ${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item_primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item_primitive number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item_primitive ${type}">${value}</div>`;
        }
        break;

      case `string`:
        html = `<pre class="console__item item item_primitive string ${this.mode === Mode.PROP ? STRING_COLLAPSED : ``} ${this.mode === Mode.ERROR ? `${this.mode}` : ``}">${value}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item_primitive symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item_primitive null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this.mode === Mode.PROP && this.type === `string`) {
      this._setCursorPointer();
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(STRING_COLLAPSED);
      });
    }
  }

  escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, `&amp;`)
        .replace(/</g, `&lt;`)
        .replace(/>/g, `&gt;`)
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#039;`);
  }
}

const MAX_HEAD_ELEMENTS_LENGTH = 5;

/**
 * Console
 * @class
 */
class Console {
  /**
   * Initialize console into container
   * @param {HTMLElement} container — console container
   * @param {{}} params — parameters
   * @property {number} params.minFieldsToExpand — min number of fields in obj to expand
   * @property {number} params.maxFieldsInHead — max number of preview fields inside head
   * @property {number} params.expandDepth — level of depth to expand
   **/
  constructor(container, params = {}) {
    if (!container) {
      throw new Error(`Console is not inited!`);
    }
    this._container = container;
    this.params = {
      object: this._parseParams(params.object, `object`),
      array: this._parseParams(params.array, `array`),
      function: this._parseParams(params.function, `function`)
    };
  }

  _parseParams(paramsObject, paramName) {
    if (paramsObject) {
      // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0
      if (typeof paramsObject.expandDepth === `number` &&
      paramsObject.expandDepth > 0) {

        paramsObject.minFieldsToExpand = (
          typeof paramsObject.minFieldsToExpand === `number` &&
          paramsObject.minFieldsToExpand > 0
        ) ? paramsObject.minFieldsToExpand : 0;
      }

      paramsObject.maxFieldsInHead = (
        typeof paramsObject.maxFieldsInHead === `number` &&
        paramsObject.maxFieldsInHead > 0
      ) ? paramsObject.maxFieldsInHead : MAX_HEAD_ELEMENTS_LENGTH;
    } else {
      paramsObject = {};
      if (paramName === `object`) {
        paramsObject.maxFieldsInHead = MAX_HEAD_ELEMENTS_LENGTH;
      }
    }
    if (!Array.isArray(paramsObject.exclude)) {
      paramsObject.exclude = [];
    } else {
      const availableTypes = [];
      for (let key in ViewType) {
        const type = ViewType[key];
        availableTypes.push(type);
      }
      if (!paramsObject.exclude.every((type) => availableTypes.includes(type))) {
        throw new Error(`Provided type to exclude is not in available types`);
      }
    }
    return paramsObject;
  }

  /**
   * Subscribe on log event fired
   * @abstract
   **/
  onlog() {}

  /**
   * Subscribe on dir event fired
   * @abstract
   **/
  ondir() {}

  /**
   * Subscribe on error event fired
   * @abstract
   **/
  onerror() {}

  /**
   * Equivalent to console.log
   * Push rest of arguments into container
   */
  log(...rest) {
    this._container.appendChild(this._getRowEl(rest, Mode.LOG));
    this.onlog();
  }

  /**
   * Equivalent to console.error
   * Push single value into conainer
   * @param {*} val — value
   */
  error(val) {
    const el = getElement(`<div class="console__row console__row_error"></div>`);
    el.appendChild(this.createTypedView(val, Mode.ERROR).el);
    this._container.appendChild(el);
    this.onerror();
  }

  /**
   * Equivalent to console.dir
   * Push single value into conainer
   * @param {*} val — value
   */
  dir(val) {
    const el = getElement(`<div class="console__row"></div>`);
    el.appendChild(this.createTypedView(val, Mode.DIR).el);
    this._container.appendChild(el);
    this.ondir();
  }

  /**
   * Clean container
   */
  clean() {
    this._container.innerHTML = ``;
  }

  createTypedView(val, mode, depth, parentView) {
    const params = {val, mode, depth, parentView, type: typeof val};
    let view;
    switch (params.type) {
      case `function`:
        view = new FunctionView(params, this);
        break;
      case `object`:
        if (val !== null) {
          if (Array.isArray(val)) {
            view = new ArrayView(params, this);
          } else {
            view = new ObjectView(params, this);
          }
        } else {
          view = new PrimitiveView(params, this);
        }
        break;
      default:
        view = new PrimitiveView(params, this);
        break;
    }
    return view;
  }

  _getRowEl(entries, mode) {
    const el = getElement(`<div class="console__row"></div>`);
    entries.forEach((val) => {
      el.appendChild(this.createTypedView(val, mode).el);
    });
    return el;
  }

  /**
   * get innerHTML of container
   */
  get sourceLog() {
    return this._container.innerHTML;
  }

  /**
   * Extend console
   * @static
   * @param {{}} consoleObject
   * @return {{}} extended console
   */
  static extend(consoleObject) {
    consoleObject.log = this.log;
    consoleObject.info = this.log;

    consoleObject.error = this.error;
    consoleObject.warn = this.error;

    consoleObject.dir = this.dir;

    return consoleObject;
  }
}

const obj = {};
const arr = [obj];
arr.push(arr);
// arr.fn = fn;
const fn = (bar = 123) => {
  return bar;
};
fn.arr = arr;
fn.obj = obj;
obj.obj = obj;
obj.arr = arr;
obj.fn = fn;

const getLengths = () => {
  const objects = Array.from(
      document.querySelectorAll(`.item.item_object .item-content-container_show .item-content.entry-container_type_object`)
  );
  const arrays = Array.from(
      document.querySelectorAll(`.item.item_array .item-content-container_show .item-content.entry-container_type_array`)
  );
  const functions = Array.from(
      document.querySelectorAll(`.item.item_function .item-content-container_show .item-content.entry-container_type_function`)
  );
  return {
    objLength: objects.length,
    arrLength: arrays.length,
    fnLength: functions.length
  };
};

describe(`Check depth object`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root object should be opened on 2 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 2 && arrLength === 1 && fnLength === 1);
  });
  it(`root object should not be opened because of minFieldsToExpand === 4 and obj has 3 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 4,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 8 && arrLength === 0 && fnLength === 6);
  });
  it(`root object should be opened with excluding nested functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 5,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    // console.log(document.querySelector(`.console`).innerHTML);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 16 && arrLength === 15 && fnLength === 0);
  });
  it(`root object should be opened with excluding nested arrays and functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        expandDepth: 7,
        exclude: [ViewType.ARRAY, ViewType.FUNCTION]
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 7 && arrLength === 0 && fnLength === 0);
  });
});

describe(`Check depth array`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root array should be opened on 2 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 1
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 1 && arrLength === 2 && fnLength === 0);
  });
  it(`root array should not be opened because of minFieldsToExpand === 3 and array has 2 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        minFieldsToExpand: 3
      }
    });
    cons.log(obj);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 4 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 6,
        exclude: [ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 31 && arrLength === 32 && fnLength === 0);
  });
  it(`root array should be opened with excluding nested objects and functions`, () => {
    cons = new Console(document.querySelector(`.console`), {
      array: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.FUNCTION]
      }
    });
    cons.log(arr);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 2 && fnLength === 0);
  });
});

describe(`Check depth function DIR`, () => {
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`root function should be opened on 4 levels`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 3,
        minFieldsToExpand: 1
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 4 && arrLength === 3 && fnLength === 3);
  });
  it(`root function should not be opened because of minFieldsToExpand === 4 and array has 3 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 2,
        minFieldsToExpand: 4
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 0);
  });
  it(`root function should be opened with excluding nested objects`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 4,
        exclude: [ViewType.OBJECT]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 3 && fnLength === 2);
  });
  it(`root function should be opened with excluding nested arrays`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 3,
        exclude: [ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 3 && arrLength === 0 && fnLength === 3);
  });
  it(`root function should be opened with excluding nested objects and arrays`, () => {
    cons = new Console(document.querySelector(`.console`), {
      function: {
        expandDepth: 2,
        exclude: [ViewType.OBJECT, ViewType.ARRAY]
      }
    });
    cons.dir(fn);
    const {objLength, arrLength, fnLength} = getLengths();
    assert(objLength === 0 && arrLength === 0 && fnLength === 2);
  });
});

describe(`in head of object must be limited number of fields`, () => {
  const localObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7
  };
  let cons = null;
  beforeEach(() => {
    const div = document.createElement(`div`);
    div.classList.add(`console`);
    document.body.appendChild(div);
  });
  afterEach(() => {
    cons.clean();
    cons = null;
  });
  it(`maxFieldsInHead === 2`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        maxFieldsInHead: 2
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container_head .entry-container__entry`)
    );
    assert(headElementsEl.length === 2);
  });
  it(`maxFieldsInHead === 5`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        maxFieldsInHead: 5
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container_head .entry-container__entry`)
    );
    assert(headElementsEl.length === 5);
  });
  it(`maxFieldsInHead === 8, but object contains 7 fields`, () => {
    cons = new Console(document.querySelector(`.console`), {
      object: {
        maxFieldsInHead: 8
      }
    });
    cons.log(localObj);
    const headElementsEl = Array.from(
        document.querySelectorAll(`.entry-container_head .entry-container__entry`)
    );
    assert(headElementsEl.length === 7);
  });
});

}());

//# sourceMappingURL=configuration.test.js.map
