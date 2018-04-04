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

  toggleHeadContentBraced() {
    this._headContentEl.classList.toggle(`entry-container--braced`);
  }

  toggleHeadContentOversized() {
    this._headContentEl.classList.toggle(`entry-container--oversize`);
  }

  toggleInfoShowed() {
    this._headInfoEl.classList.toggle(`item__head-info--show`);
  }

  toggleContentLengthShowed() {
    this._headContentLengthEl.classList.toggle(`item__head-content-length--show`);
  }

  toggleHeadContentShowed() {
    this._headContentEl.classList.toggle(`item__head-content--show`);
  }

  toggleContentShowed() {
    this.el.classList.toggle(`item--show-content`);
  }

  toggleError() {
    this.el.classList.toggle(Mode.ERROR);
  }

  _setCursorPointer() {
    this._headEl.classList.add(`item__head--pointer`);
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

  _toggleContent() {
    this.toggleContentShowed();
    if (this._contentEl.childElementCount === 0) {
      this._contentEl.appendChild(this.createContent(this.value, false).fragment);
    }
  }

  _hideContent() {
    this._proxiedContentEl.style.display = `none`;
  }

  _additionHeadClickHandler() {}

  _setHeadClickHandler() {
    this._setCursorPointer();
    this._headEl.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._toggleContent();
      this._additionHeadClickHandler();
    });
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
/* eslint no-empty: "off"*/
class ObjectView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }
    const stringTag = Object.prototype.toString.call(this.value);
    this._stringTagName = stringTag.substring(8, stringTag.length - 1);
    this._constructorName = this.value.constructor.name;
  }

  afterRender() {
    const {
      elOrStr,
      isShowConstructor,
      isHeadContentShowed,
      isBraced,
      isOpeningDisabled,
      isOversized,
      isStringified,
      headContentClassName
    } = this._getHeadContent();

    if (headContentClassName) {
      this._headContentEl.classList.add(headContentClassName);
    }
    if (isBraced) {
      this.toggleHeadContentBraced();
    }
    if (isOversized) {
      this.toggleHeadContentOversized();
    }

    if (this._constructorName === `Object` && this._stringTagName !== `Object`) {
      this._headInfoEl.textContent = this._stringTagName;
    } else {
      this._headInfoEl.textContent = this._constructorName;
    }
    if (isShowConstructor) {
      this.toggleInfoShowed();
    }

    if (isHeadContentShowed) {
      if (elOrStr instanceof HTMLElement || elOrStr instanceof DocumentFragment) {
        this._headContentEl.appendChild(elOrStr);
      } else {
        this._headContentEl.innerHTML = elOrStr;
      }
      this.toggleHeadContentShowed();
    }

    if (this._mode === Mode.LOG || this._mode === Mode.ERROR && !this._parentView && !isStringified) {
      this._headEl.classList.add(`item__head--italic`);
    }

    if (this._mode === Mode.ERROR && isStringified) {
      this.toggleError();
    }

    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (!isOpeningDisabled) {
      if (this._isAutoExpandNeeded) {
        this._toggleContent();
      }
      this._setHeadClickHandler();
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
    if (this._stringTagName === `Object`) {
      return {
        elOrStr: `...`,
        isShowConstructor: false,
        isHeadContentShowed: true,
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
    let isOversized = false;
    let isStringified = false;
    let headContentClassName;

    if (this.value instanceof HTMLElement && Object.getPrototypeOf(this.value).constructor !== HTMLElement) {
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
      headContentClassName = `regexp`;
      isOpeningDisabled = true;
      isBraced = false;
    } else {
      const obj = this.createContent(this.value, true);
      val = obj.fragment;
      isOversized = obj.isOversized;
      if (this._stringTagName !== `Object` || this._constructorName !== `Object`) {
        isShowConstructor = true;
      }
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isHeadContentShowed: true,
      isBraced,
      isOpeningDisabled,
      isOversized,
      isStringified,
      headContentClassName
    };
  }

  _getHeadDirContent() {
    let val;
    let isShowConstructor = false;
    let isHeadContentShowed = true;
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
      isHeadContentShowed = false;
    }
    return {
      elOrStr: val,
      isShowConstructor,
      isHeadContentShowed,
      isBraced
    };
  }

  createContent(obj, isPreview) {
    const fragment = document.createDocumentFragment();
    const addedKeys = new Set();
    // TODO: Добавить счётчик, чтобы больше 5 значений не добавлялось
    for (let key in obj) {
      if (isPreview && !obj.hasOwnProperty(key)) { // Перечисляемые свои
        continue;
      }
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversized: true
        };
      }
      try {
        const val = obj[key];
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
        addedKeys.add(key);
      } catch (err) {}
    }
    const ownPropertyNamesAndSymbols = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
    for (let key of ownPropertyNamesAndSymbols) { // Неперечисляемые свои
      if (addedKeys.has(key)) {
        continue;
      }
      if (isPreview && addedKeys.size === this._console.params[this._viewType].maxFieldsInHead) {
        return {
          fragment,
          isOversized: true
        };
      }
      try {
        const val = obj[key];
        fragment.appendChild(this._createObjectEntryEl(key, val, isPreview));
        addedKeys.add(key);
      } catch (err) {}
    }
    return {
      fragment,
      isOversized: false
    };
  }

  _createObjectEntryEl(key, val, isPreview) {
    const view = this._console.createTypedView(val, isPreview ? Mode.PREVIEW : Mode.PROP, this.nextNestingLevel, this);
    return ObjectView.createEntryEl(key.toString(), view.el);
  }
}

class ArrayView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this._viewType = ViewType.ARRAY;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }

    this._templateParams.withHeadContentlength = true;
  }

  afterRender() {
    const {isShowConstructor, isHeadContentShowed, isShowLength} = this._getHeadContent();
    this.toggleHeadContentBraced();
    this._headInfoEl.textContent = this.value.constructor.name;
    if (isShowConstructor) {
      this.toggleInfoShowed();
    }
    if (isHeadContentShowed) {
      this.toggleHeadContentShowed();
      this._headContentEl.appendChild(this.createContent(this.value, true).fragment);
    }
    if (isShowLength) {
      this.toggleContentLengthShowed();
    }
    if (this._mode === Mode.LOG || this._mode === Mode.ERROR && !this._parentView) {
      this._headEl.classList.add(`item__head--italic`);
    }
    if (this._mode === Mode.PREVIEW) {
      return;
    }
    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler();
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode.PROP) {
      this.toggleInfoShowed();
      this.toggleContentLengthShowed();
      this.toggleHeadContentShowed();
    }
  }

  _getHeadContent() {
    let isShowConstructor = false;
    let isHeadContentShowed = true;
    let isShowLength = this.value.length > 1;
    if (this._mode === Mode.DIR) {
      isShowConstructor = true;
      isHeadContentShowed = false;
      isShowLength = true;
    } else if (this._mode === Mode.PREVIEW) {
      isShowConstructor = true;
      isHeadContentShowed = false;
      isShowLength = true;
    }
    return {
      isShowConstructor,
      isHeadContentShowed,
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
    return ArrayView.createEntryEl(key.toString(), view.el, isPreview ? !isKeyNaN : isPreview);
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
    this._viewType = ViewType.FUNCTION;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }
    this._fnType = FunctionView.checkFnType(this.value);
  }

  afterRender() {
    this._headEl.classList.add(`item__head--italic`);
    this._headInfoEl.classList.add(`item__head-info--function`);
    switch (this._fnType) {
      case FnType.CLASS:
        this._headInfoEl.textContent = `class`;
        break;
      case FnType.PLAIN:
      case FnType.ARROW:
        this._headInfoEl.textContent = `f`;
        break;
    }
    let isShowInfo = false;
    if (this._fnType !== FnType.ARROW) {
      isShowInfo = true;
    }
    switch (this._mode) {
      case Mode.PROP:
        this._headContentEl.innerHTML = this._getHeadPropMarkup();
        break;
      case Mode.DIR:
        this._headContentEl.innerHTML = this._getHeadDirMarkup();
        break;
      case Mode.LOG:
      case Mode.ERROR:
        this._headContentEl.innerHTML = this._getHeadLogMarkup();
        break;
      case Mode.PREVIEW:
        isShowInfo = true;
        break;
    }
    if (isShowInfo) {
      this.toggleInfoShowed();
    }

    if (this._mode !== Mode.PREVIEW) {
      this.toggleHeadContentShowed();
    }

    if (this._mode !== Mode.DIR && this._mode !== Mode.PROP) {
      return;
    }

    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler();
  }

  _getHeadPropMarkup() {
    const {name, params, lines} = this.parseFunction(this.value);
    const joinedLines = lines.join(`\n`);

    let markup = `\
<span>\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType !== FnType.CLASS) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{...}`}`;
    }
    markup += `</span>`;
    return markup;
  }

  _getHeadDirMarkup() {
    const {name, params} = this.parseFunction(this.value);

    let markup = `\
${name ? name : ``}\
${this._fnType === FnType.PLAIN ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? `()` : ``}`;
    return markup;
  }

  _getHeadLogMarkup() {
    const {name, params, lines} = this.parseFunction(this.value);
    return `\
<pre>\
${name && this._fnType !== FnType.ARROW ? `${name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${lines.join(`\n`)}\
</pre>`;
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

    const bodyContent = funString.substring(bodyStart, bodyEnd + 1).trim();

    if (!bodyContent) {
      return [];
    }

    return bodyContent.split(`\n`);
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
    const fnKeys = [`name`, `prototype`, `length`, `__proto__`];
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
      const entryEl = FunctionView.createEntryEl(key.toString(), view.el);
      fragment.appendChild(entryEl);
    }
    return {fragment};
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
}

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
        html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        break;

      case `number`:
        if (Number.isNaN(value)) {
          html = `<div class="console__item item item--primitive NaN">NaN</div>`;
        } else if ((value === Infinity || value === -Infinity)) {
          html = `<div class="console__item item item--primitive number">${(value === -Infinity ? `-` : ``)}Infinity</div>`;
        } else {
          html = `<div class="console__item item item--primitive ${type}">${value}</div>`;
        }
        break;

      case `string`:
        let str;
        if (this._mode === Mode.PREVIEW && value.length > 100) {
          str = `${value.substr(0, 50)}...${value.substr(-50)}`;
        } else {
          str = value;
        }
        html = `<pre class="console__item item item--primitive string ${this._mode === Mode.PROP || this._mode === Mode.PREVIEW ? `string--nowrap` : ``} ${this._mode === Mode.PROP ? `pointer` : ``} ${this._mode === Mode.ERROR ? `${this._mode}` : ``}">${str}</pre>`;
        break;
      case `symbol`:
        html = `<div class="console__item item item--primitive symbol">${value}</div>`;
        break;

      case `object`:
        if (value === null) {
          html = `<div class="console__item item item--primitive null">${value}</div>`;
          break;
        }
    }
    return html;
  }

  bind() {
    if (this._mode === Mode.PROP && this._type === `string`) {
      this.el.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this.el.classList.toggle(`string--nowrap`);
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
        if (ViewType.hasOwnProperty(key)) {
          const type = ViewType[key];
          availableTypes.push(type);
        }
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
    const el = getElement(`<div class="console__row console__row--error"></div>`);
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
   * @param {{}} consoleObject
   * @return {{}} extended console
   */
  extend(consoleObject) {
    consoleObject.log = this.log.bind(this);
    consoleObject.info = this.log.bind(this);

    consoleObject.error = this.error.bind(this);
    consoleObject.warn = this.error.bind(this);

    consoleObject.dir = this.dir.bind(this);
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
      document.querySelectorAll(`.item.item--object.item--show-content > .item__content.entry-container--object`)
  );
  const arrays = Array.from(
      document.querySelectorAll(`.item.item--array.item--show-content > .item__content.entry-container--array`)
  );
  const functions = Array.from(
      document.querySelectorAll(`.item.item--function.item--show-content > .item__content.entry-container--function`)
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
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
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
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
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
        document.querySelectorAll(`.entry-container--head .entry-container__entry`)
    );
    assert(headElementsEl.length === 7);
  });
});

}());

//# sourceMappingURL=configuration.test.js.map
