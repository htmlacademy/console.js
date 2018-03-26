(function () {
'use strict';

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

const Mode$1 = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  PROP: `prop`,
  ERROR: `error`
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
  constructor(value, type, isPrimitive) {
    super();
    this._value = value;
    this._type = type;
    this._isPrimitive = isPrimitive;
    this._isOpened = false;
  }

  get value() {
    return this._value;
  }

  get type() {
    return this._type;
  }

  get isPrimitive() {
    return this._isPrimitive;
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
      this._proxiedContentEl = getElement(`<div class="console__item item-content"></div>`);
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
const MAX_HEAD_ELEMENTS_LENGTH = 5;

class ObjectView extends TypeView {
  constructor(value, mode) {
    super(value, `object`, false);
    this._mode = mode;
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
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container entry-container_type_object"></div>
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

    if (this._mode === Mode$1.ERROR && isStringified) {
      this.el.classList.add(this._mode);
    }

    if (this._mode === Mode$1.PREVIEW) {
      return;
    }
    if (!isOpeningDisabled) {
      this._setHeadClickHandler(headEl);
    }
  }

  _getHeadContent() {
    if (this._mode === Mode$1.DIR) {
      return this._getHeadDirContent();
    } else if (this._mode === Mode$1.LOG || this._mode === Mode$1.PROP || this._mode === Mode$1.ERROR) {
      return this._getHeadLogContent();
    } else if (this._mode === Mode$1.PREVIEW) {
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
      const view = createTypedView(Number.parseInt(this.value, 10), Mode$1.PREVIEW);
      val = view.el;
      isShowConstructor = true;
    } else if (this.value instanceof String) {
      const view = createTypedView(this.value.toString(), Mode$1.PREVIEW);
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
    const keys = new Set();
    // TODO: Добавить счётчик, чтобы больше 5 значений не добавлялось
    for (let key in obj) {
      keys.add(key);
      if (isPreview && keys.size === MAX_HEAD_ELEMENTS_LENGTH) {
        return {
          fragment,
          isOversize: true
        };
      }
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode$1.PREVIEW : Mode$1.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    for (let key of Object.getOwnPropertyNames(obj)) {
      if (keys.has(key)) {
        continue;
      }
      keys.add(key);
      if (isPreview && keys.size === MAX_HEAD_ELEMENTS_LENGTH) {
        return {
          fragment,
          isOversize: true
        };
      }
      const value = obj[key];
      const view = createTypedView(value, isPreview ? Mode$1.PREVIEW : Mode$1.PROP);
      const entryEl = ObjectView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return {
      fragment,
      isOversize: false
    };
  }
}

class ArrayView extends TypeView {
  constructor(arr, mode) {
    super(arr, `array`, false);
    this._mode = mode;
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
  <div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container entry-container_type_array"></div>
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
    if (this._mode === Mode$1.PREVIEW) {
      return;
    }
    this._setHeadClickHandler(this.headEl);
  }

  _additionHeadClickHandler() {
    if (this._mode === Mode$1.PROP) {
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
    if (this._mode === Mode$1.DIR) {
      isShowConstructor = true;
      isShowElements = false;
    // } else if (this._mode === Mode.PROP) {
    } else if (this._mode === Mode$1.PREVIEW) {
      isShowConstructor = true;
      isShowElements = false;
      isShowLength = true;
    } else if (this._mode === Mode$1.ERROR) {
      return this._getHeadErrorContent();
    }
    return {
      isShowConstructor,
      isShowElements,
      isShowLength
    };
  }

  createContent(arr, isPreview) {
    const ownPropertyNames = Object.getOwnPropertyNames(arr);
    const keys = Object.keys(arr);
    const fragment = document.createDocumentFragment();
    for (let key of ownPropertyNames) {
      const value = arr[key];
      const indexInKeys = keys.indexOf(key);
      const isKeyNaN = Number.isNaN(Number.parseInt(key, 10));
      if (isPreview && indexInKeys === -1) {
        continue;
      }
      const view = createTypedView(value, isPreview ? Mode$1.PREVIEW : Mode$1.PROP);
      const entryEl = ArrayView.createEntryEl(key, view.el, isPreview ? !isKeyNaN : isPreview);
      // if (!isPreview) {
      //   this._elements.set(entryEl, view);
      // }
      fragment.appendChild(entryEl);
    }
    return {fragment};
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
  constructor(fn, mode) {
    super(fn, `function`, false);
    this._mode = mode;
    this._isOpened = false;
    this._fnType = FunctionView.checkFnType(fn);
  }

  get template() {
    let tpl = `<div class="console__item item item_function ${this._mode === Mode$1.ERROR ? `${this._mode}` : ``}">`;
    switch (this._mode) {
      case Mode$1.PREVIEW:
        tpl += `f`;
        break;
      case Mode$1.PROP:
        tpl += `\
<div class="${Class.CONSOLE_ITEM_HEAD}">${this._getHeadPropMarkup()}</div>\
<div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container"></div>`;
        break;
      case Mode$1.DIR:
        tpl += `\
<div class="${Class.CONSOLE_ITEM_HEAD}">${this._getHeadDirMarkup()}</div>\
<div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER} entry-container"></div>`;
        break;
      case Mode$1.LOG:
      case Mode$1.ERROR:
        tpl += this._getLogMarkup();
        break;
    }
    tpl += `</div>`;
    return tpl;
  }

  bind() {
    if (this._mode !== Mode$1.DIR && this._mode !== Mode$1.PROP) {
      return;
    }

    this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
    const headEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
    // previewEl.appendChild(this.createPreview(this.value, true));
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
    const keys = [`name`, `prototype`, `caller`, `arguments`, `length`, `__proto__`];
    for (let key of keys) {
      let value;
      try {
        value = fn[key];
      } catch (err) {
        continue;
      }
      const view = createTypedView(value, Mode$1.DIR);
      const entryEl = FunctionView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return {fragment};
  }
}

const STRING_COLLAPSED = `string_collapsed`;

class PrimitiveView extends TypeView {
  constructor(value, mode, type) {
    super(value, type, true);
    this._mode = mode;
  }

  get template() {
    const type = this.type;
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
        html = `<pre class="console__item item item_primitive string ${this._mode === Mode$1.PROP ? STRING_COLLAPSED : ``} ${this._mode === Mode$1.ERROR ? `${this._mode}` : ``}">${value}</pre>`;
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
    if (this._mode === Mode$1.PROP && this.type === `string`) {
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

const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};



// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
const createTypedView = (val, mode) => {
  let view;
  const type = typeof val;
  switch (type) {
    case `function`:
      view = new FunctionView(val, mode);
      break;
    case `object`:
      // TODO: check instanceof Date, String, Boolean, Number
      if (val !== null) {
        if (Array.isArray(val)) { // TODO: typedarrays, arraybuffer, etc
          view = new ArrayView(val, mode);
        } else {
          view = new ObjectView(val, mode);
        }
      } else {
        view = new PrimitiveView(val, mode, type);
      }
      break;
    default:
      view = new PrimitiveView(val, mode, type);
      break;
  }
  return view;
};

// import babelPolyfill from 'babel-polyfill';
// import whatwgFetch from 'whatwg-fetch';
const Mode = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  ERROR: `error`
};

const getRowEl = (entries, mode) => {
  const el = getElement(`<div class="console__row"></div>`);
  entries.forEach(function (code) {
    el.appendChild(createTypedView(code, mode).el);
  });
  return el;
};

/**
 * Init Console
 *
 * @param {HTMLElement} cont — console container
 * @return {{log: log}}
 */
class Console {
  constructor(cont) {
    if (!cont) {
      throw Error(`Console is not inited!`);
    }
    this._cont = cont;
  }

  /**
   * Show formatted & highlighted code into `cont`
   */
  log(...rest) {
    this._cont.appendChild(getRowEl(rest, Mode.LOG));
  }

  error(errOrSmth) {
    const el = getElement(`<div class="console__row console__row_error"></div>`);
    el.appendChild(createTypedView(errOrSmth, Mode.ERROR).el);
    this._cont.appendChild(el);
  }

  clean() {
    this._cont.innerHTML = ``;
  }

  getLogSource() {
    return this._cont.innerHTML;
  }

  dir(val) {
    const el = getElement(`<div class="console__row"></div>`);
    el.appendChild(createTypedView(val, Mode.DIR).el);
    this._cont.appendChild(el);
  }

  extend(consoleObject) {
    consoleObject.log = this.log.bind(this);
    consoleObject.info = this.log.bind(this);

    consoleObject.error = this.error.bind(this);
    consoleObject.warn = this.error.bind(this);

    consoleObject.dir = this.dir.bind(this);

    return consoleObject;
  }
}

const CSS_URL = `//htmlacademy.github.io/console.js/css/style.css`;

const errors = [];
const collectErr = function (evt) {
  errors.push(evt.error);
};
window.addEventListener(`error`, collectErr);
window.console.warn = collectErr;
window.console.error = collectErr;

const messages = [];
const collectLogs = function (...rest) {
  messages.push(...rest);
};

const dirs = [];
const collectDirs = (val) => {
  dirs.push(val);
};

window.console.info = collectLogs;
window.console.log = collectLogs;
window.console.dir = collectDirs;
// window.console.debug = collectMsg;

const init = function () {
  const div = window.document.createElement(`div`);
  div.classList.add(`console`);
  const jsConsole = new Console(div);
  window.document.body.appendChild(div);

  jsConsole.extend(window.console);

  errors.forEach(function (err) {
    jsConsole.error(err);
  });
  messages.forEach(function (val) {
    jsConsole.log(val);
  });
  dirs.forEach((val) => {
    jsConsole.dir(val);
  });
  window.addEventListener(`error`, (evt) => {
    jsConsole.error(evt.error);
  });
};

const loadStyles = function () {
  const link = window.document.createElement(`link`);
  link.rel = `stylesheet`;
  link.href = CSS_URL;
  window.document.head.appendChild(link);
};

window.addEventListener(`DOMContentLoaded`, function () {
  init();
  loadStyles();
});

}());

//# sourceMappingURL=index-silent.js.map
