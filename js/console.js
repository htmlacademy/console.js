/* eslint no-empty: "off"*/
import mergeWith from 'lodash.mergewith';
import ObjectView from './object/object-view';
import MapSetView from './object/map-set-view';
import PromiseView from './object/promise-view';
import StringNumberView from './object/string-number-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import PrimitiveView from './primitive/primitive-view';
import {getElement, customizer, checkObjectisPrototype, checkEnumContainsValue} from './utils';
import {Mode, ViewType, Env} from './enums';

const DEFAULT_MAX_FIELDS_IN_HEAD = 5;

/**
 * Console
 * @class
 */
export default class Console {
  /**
   * Initialize console into container
   * @param {HTMLElement} container — console container
   * @param {{}} params — parameters
   * @param {number} params.minFieldsToExpand — min number of fields in obj to expand
   * @param {number} params.maxFieldsInHead — max number of preview fields inside head
   * @param {number} params.expandDepth — level of depth to expand
   * @param {Env} params.env — environment
   **/
  constructor(container, params = {}) {
    if (!container) {
      throw new Error(`Console is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }

    this._el = document.createElement(`div`);
    this._el.classList.add(`console`);
    container.appendChild(this._el);

    this.params = {
      object: this._parseViewParams(ViewType.OBJECT, mergeWith({}, params.common, params.object, customizer)),
      array: this._parseViewParams(ViewType.ARRAY, mergeWith({}, params.common, params.array, customizer)),
      function: this._parseViewParams(ViewType.FUNCTION, mergeWith({}, params.common, params.function, customizer))
    };

    Object.assign(this.params, this._parseConsoleParams(params));
    this.params.global.TypedArray = Object.getPrototypeOf(Int8Array);
  }

  _parseConsoleParams(params) {
    const parsedParams = {};

    if (checkEnumContainsValue(Env, params.env)) {
      parsedParams.env = params.env;
    }

    parsedParams.global = params.global ? params.global : window;

    return parsedParams;
  }

  _parseViewParams(viewType, params = {}) {
    // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0

    params.expandDepth = (
      typeof params.expandDepth === `number` &&
      params.expandDepth > 0
    ) ? params.expandDepth : 0;


    params.minFieldsToExpand = (
      typeof params.minFieldsToExpand === `number` &&
      params.minFieldsToExpand > 0
    ) ? params.minFieldsToExpand : 0;

    params.maxFieldsToExpand = (
      typeof params.maxFieldsToExpand === `number` &&
      params.maxFieldsToExpand > 0
    ) ? params.maxFieldsToExpand : Number.POSITIVE_INFINITY;

    params.maxFieldsInHead = (
      typeof params.maxFieldsInHead === `number` &&
      params.maxFieldsInHead > 0
    ) ? params.maxFieldsInHead : DEFAULT_MAX_FIELDS_IN_HEAD;

    if (!Array.isArray(params.excludeProperties)) {
      params.excludeProperties = [];
    }
    if (!Array.isArray(params.exclude)) {
      params.exclude = [];
    } else {
      const availableTypes = [];
      for (let key in ViewType) {
        if (ViewType.hasOwnProperty(key)) {
          const type = ViewType[key];
          availableTypes.push(type);
        }
      }
      if (!params.exclude.every((type) => availableTypes.includes(type))) {
        throw new Error(`Provided type to exclude is not in available types`);
      }
    }

    params.showGetters = typeof params.showGetters === `boolean` ?
      params.showGetters : true;

    params.countEntriesWithoutKeys = typeof params.countEntriesWithoutKeys === `boolean` ?
      params.countEntriesWithoutKeys : false;

    return params;
  }

  /**
   * This is implementation of https://console.spec.whatwg.org/#logger
   * @param {{}} opts
   * @param {[]} entries
   */
  _log(opts, entries) {
    if (!entries.length) {
      return;
    }

    // if (entries.length > 1 && entries[0].search(/specifiers/)) {
    // this._print(opts.mode, this._format(entries));
    // return;
    // }

    this._print(opts, entries);
  }

  _format() {

  }

  _print({mode, modifier, onPrint}, values) {
    const rowEl = getElement(`<div class="console__row ${modifier ? `console__row--${modifier}` : ``}"></div>`);
    values.forEach((val) => {
      rowEl.appendChild(this.createTypedView(val, mode).el);
    });
    this._el.appendChild(rowEl);
    onPrint(rowEl);
    this.onAny(rowEl);
  }

  /**
   * Subscribe on any event fired
   * @abstract
   */
  onAny() {}

  /**
   * Subscribe on log event fired
   * @abstract
   **/
  onLog() {}

  /**
   * Subscribe on logHTML event fired
   * @abstract
   **/
  onLogHTML() {}

  /**
   * Subscribe on dir event fired
   * @abstract
   **/
  onDir() {}

  /**
   * Subscribe on error event fired
   * @abstract
   **/
  onError() {}

  /**
   * Equivalent to console.log
   * Push rest of arguments into container
   */
  log(...entries) {
    this._log({mode: Mode.LOG, onPrint: this.onLog}, entries);
  }
  /**
   * Equivalent to this.log but marks row as output
   */
  logOutput(...entries) {
    this._log({mode: Mode.LOG, modifier: `output`, onPrint: this.onLog}, entries);
  }

  /**
   * Equivalent to console.log but special charachters in strings won't be excaped
   * Push rest of arguments into container
   */
  logHTML(...entries) {
    this._log({mode: Mode.LOG_HTML, onPrint: this.onLogHTML}, entries);
  }

  /**
   * Equivalent to console.error
   * Push single value into conainer
   */
  error(...entries) {
    this._log({mode: Mode.ERROR, modifier: `error`, onPrint: this.onError}, entries);
  }

  /**
   * Equivalent to console.dir
   * Push single value into container
   */
  dir(...entries) {
    if (!entries.length) {
      return;
    }
    this._print({mode: Mode.DIR, onPrint: this.onDir}, [entries[0]]);
  }

  /**
   * Logs user input into container
   * Marks row as input
   * @param {string} markup
   */
  prompt(markup) {
    const rowEl = getElement(`<div class="console__row console__row--input"><pre class="console__item item"></pre></div>`);
    rowEl.querySelector(`.console__item`).innerHTML = markup;
    this._el.appendChild(rowEl);
    this.onAny(rowEl);
  }

  /**
   * Clean container
   */
  clean() {
    this._el.innerHTML = ``;
  }

  checkInstanceOf(obj, constructorName) {
    return obj instanceof this.params.global[constructorName];
  }

  createTypedView(val, mode, depth, parentView, propKey) {
    const params = {val, mode, depth, parentView, type: typeof val, propKey};
    switch (params.type) {
      case `function`:
        return new FunctionView(params, this);
      case `object`:
        if (val !== null) {
          let view;
          const stringTag = Object.prototype.toString.call(val);
          const stringTagName = stringTag.substring(8, stringTag.length - 1);

          const objectIsPrototype = checkObjectisPrototype(val);
          if (stringTagName !== `Object` && (
            Array.isArray(val) || (
              !objectIsPrototype && (
                this.checkInstanceOf(val, `HTMLCollection`) ||
                this.checkInstanceOf(val, `NodeList`) ||
                this.checkInstanceOf(val, `DOMTokenList`) ||
                this.checkInstanceOf(val, `TypedArray`) ||
                stringTagName === `Arguments`
              )
            )
          )) {
            view = new ArrayView(params, this);
          } else if (!objectIsPrototype && (this.checkInstanceOf(val, `Map`) || this.checkInstanceOf(val, `Set`))) {
            view = new MapSetView(params, this);
          } else if (!objectIsPrototype && val instanceof Promise) {
            view = new PromiseView(params, this);
          } else if (!objectIsPrototype && (this.checkInstanceOf(val, `String`) || this.checkInstanceOf(val, `Number`))) {
            view = new StringNumberView(params, this);
          } else {
            view = new ObjectView(params, this);
          }
          view.stringTagName = stringTagName;
          return view;
        } else {
          return new PrimitiveView(params, this);
        }
      default:
        return new PrimitiveView(params, this);
    }
  }

  _getRowEl(entries, mode, modifier) {
    const el = getElement(`<div class="console__row ${modifier ? `console__row--${modifier}` : ``}"></div>`);
    entries.forEach((val) => {
      el.appendChild(this.createTypedView(val, mode).el);
    });
    return el;
  }

  /**
   * get innerHTML of container
   */
  get sourceLog() {
    return this._el.innerHTML;
  }

  /**
   * Extend console
   * @param {{}} consoleObject
   * @return {{}} extended console
   */
  extend(consoleObject) {
    consoleObject.log = this.log.bind(this);
    consoleObject.logHTML = this.logHTML.bind(this);
    consoleObject.info = this.log.bind(this);

    consoleObject.error = this.error.bind(this);
    consoleObject.warn = this.error.bind(this);

    consoleObject.dir = this.dir.bind(this);
    return consoleObject;
  }
}
