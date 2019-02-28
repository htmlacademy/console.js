/* eslint no-empty: "off"*/
import ObjectView from './object/object-view';
import MapSetView from './object/map-set-view';
import PromiseView from './object/promise-view';
import StringNumberView from './object/string-number-view';
import ObjectNodeView from './object/object-node-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import PrimitiveView from './primitive/primitive-view';
import NodeView from './node/node-view';
// import NodeView from './object/node-view';
import mergeParams from './utils/merge-params';
import {getElement, checkObjectisPrototype, checkEnumContainsValue} from './utils';
import {Mode, ViewType, Env} from './enums';

const DEFAULT_MAX_FIELDS_IN_HEAD = 5;

// const getSpecifiresRE = () => /%s|%d|%i|%f|%o|%O/g;

/**
 * Console
 * @class
 */
export default class Console {
  /**
   * Initialize console into container
   * @param {HTMLElement} container — console container
   * @param {{}} config — parameters
   * @param {number} params.minFieldsToAutoexpand — min number of fields in obj to expand
   * @param {number} params.maxFieldsInHead — max number of preview fields inside head
   * @param {number} params.expandDepth — level of depth to expand
   * @param {Env} params.env — environment
   **/
  constructor(container, config = {}) {
    if (!container) {
      throw new Error(`Console is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }

    this._el = document.createElement(`div`);
    this._el.classList.add(`console`);
    container.appendChild(this._el);

    this.addConfig(config);
    this.params.global.TypedArray = Object.getPrototypeOf(Int8Array);
  }

  addConfig(config = {}) {
    if (!this._configs) {
      this._configs = [];
    }
    this._configs.push(config);
    const mergedParams = mergeParams(this._configs);
    this.params = {
      object: this._parseViewParams(ViewType.OBJECT, mergeParams([{}, mergedParams.common, mergedParams.object])),
      array: this._parseViewParams(ViewType.ARRAY, mergeParams([{}, mergedParams.common, mergedParams.array])),
      function: this._parseViewParams(ViewType.FUNCTION, mergeParams([{}, mergedParams.common, mergedParams.function])),
      node: this._parseViewParams(ViewType.NODE, mergeParams([{}, mergedParams.common, mergedParams.node]))
    };
    Object.assign(this.params, this._parseConsoleParams(mergedParams));
  }

  _parseConsoleParams(params) {
    const parsedParams = {};

    if (checkEnumContainsValue(Env, params.env)) {
      parsedParams.env = params.env;
    }

    parsedParams.global = params.global ? params.global : window;

    return parsedParams;
  }

  /**
   * @param {ViewType} viewType
   * @param {{}} params
   * @param {number} params.minFieldsToAutoexpand=0 — min number of fields in obj to expand
   * @param {number} params.maxFieldsToAutoexpand=Number.POSITIVE_INFINITY - max number of fields in obj to expand
   * @param {number} params.maxFieldsInHead=DEFAULT_MAX_FIELDS_IN_HEAD — max number of preview fields inside head
   * @param {number} params.expandDepth=0 — level of depth to expand
   * @param {[string]} params.removeProperties=[] — array of properties those won't show up
   * @param {[string]} params.excludePropertiesFromAutoexpand=[] — array of properties those won't autoexpand
   * @param {[ViewType]} params.excludeViewTypesFromAutoexpand=[] — array of view types those won't autoexpand
   * @param {boolean} params.showGetters=true — show getters in view or not
   * @param {boolean} params.showSymbols=true — show symbols in view or not
   * @param {boolean} params.countEntriesWithoutKeys=false — (applies only to ArrayView) count indexed entries or not
   * @param {boolean} params.nowrapOnLog=false — specifies if functions bodies will be collapsed
   * @return {{}} parsed params
   */
  _parseViewParams(viewType, params = {}) {
    // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0

    params.expandDepth = (
      typeof params.expandDepth === `number` &&
      params.expandDepth > 0
    ) ? params.expandDepth : 0;


    params.minFieldsToAutoexpand = (
      typeof params.minFieldsToAutoexpand === `number` &&
      params.minFieldsToAutoexpand > 0
    ) ? params.minFieldsToAutoexpand : 0;

    params.maxFieldsToAutoexpand = (
      typeof params.maxFieldsToAutoexpand === `number` &&
      params.maxFieldsToAutoexpand > 0
    ) ? params.maxFieldsToAutoexpand : Number.POSITIVE_INFINITY;

    params.maxFieldsInHead = (
      typeof params.maxFieldsInHead === `number` &&
      params.maxFieldsInHead > 0
    ) ? params.maxFieldsInHead : DEFAULT_MAX_FIELDS_IN_HEAD;

    if (!Array.isArray(params.removeProperties)) {
      params.removeProperties = [];
    }
    if (!Array.isArray(params.excludePropertiesFromAutoexpand)) {
      params.excludePropertiesFromAutoexpand = [];
    }
    if (!Array.isArray(params.excludeViewTypesFromAutoexpand)) {
      params.excludeViewTypesFromAutoexpand = [];
    } else {
      const availableTypes = [];
      for (let key in ViewType) {
        if (ViewType.hasOwnProperty(key)) {
          const type = ViewType[key];
          availableTypes.push(type);
        }
      }
      if (!params.excludeViewTypesFromAutoexpand.every((type) => availableTypes.includes(type))) {
        throw new Error(`Provided type to exclude is not in available types`);
      }
    }

    params.showGetters = typeof params.showGetters === `boolean` ?
      params.showGetters : true;

    params.showSymbols = typeof params.showSymbols === `boolean` ?
      params.showSymbols : true;

    params.countEntriesWithoutKeys = typeof params.countEntriesWithoutKeys === `boolean` ?
      params.countEntriesWithoutKeys : false;

    params.nowrapOnLog = typeof params.nowrapOnLog === `boolean` ?
      params.nowrapOnLog : false;

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

    // if (entries.length > 1 && getSpecifiresRE().test(entries[0])) {
    //   this._print(opts, this._format(entries));
    //   return;
    // }

    this._print(opts, entries);
  }

  // _format(entries) {
  //   let targetStr = entries.shift();
  //
  //   const re = getSpecifiresRE();
  //
  //   let match;
  //   while ((match = re.exec(targetStr)) !== null) {
  //     const substitution = entries.shift();
  //     const specifier = match[0];
  //     let convertedSubstitution;
  //     switch (specifier) {
  //       case `%s`:
  //         convertedSubstitution = substitution;
  //         break;
  //       case `%d`:
  //       case `%i`:
  //         if (typeof substitution === `symbol`) {
  //           convertedSubstitution = Number.NaN;
  //         } else {
  //           convertedSubstitution = Number.parseInt(substitution, 10);
  //         }
  //         break;
  //       case `%f`:
  //         if (typeof substitution === `symbol`) {
  //           convertedSubstitution = Number.NaN;
  //         } else {
  //           convertedSubstitution = Number.parseFloat(substitution);
  //         }
  //         break;
  //       case `%o`:
  //
  //         break;
  //       case `%O`:
  //
  //         break;
  //     }
  //     targetStr = targetStr.replace(specifier, convertedSubstitution);
  //   }
  //   entries.unshift(targetStr);
  //   return entries;
  // }

  _print({mode, modifier, onPrint}, values) {
    const rowEl = getElement(`<div class="console__row ${modifier ? `console__row--${modifier}` : ``}"></div>`);
    values.forEach((val) => {
      rowEl.appendChild(this.createTypedView(val, mode).el);
    });
    this._el.appendChild(rowEl);
    if (onPrint) {
      onPrint(rowEl);
    }
    this.onAny(rowEl);
  }

  _getRowEl(entries, mode, modifier) {
    const el = getElement(`<div class="console__row ${modifier ? `console__row--${modifier}` : ``}"></div>`);
    entries.forEach((val) => {
      el.appendChild(this.createTypedView(val, mode).el);
    });
    return el;
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
          } else if (!objectIsPrototype && this.checkInstanceOf(val, `Promise`)) {
            view = new PromiseView(params, this);
          } else if (!objectIsPrototype && (this.checkInstanceOf(val, `String`) || this.checkInstanceOf(val, `Number`))) {
            view = new StringNumberView(params, this);
          } else if (!objectIsPrototype && this.checkInstanceOf(val, `Node`)) {
            if (mode === Mode.LOG || mode === Mode.LOG_HTML || mode === Mode.ERROR) {
              view = new NodeView(params, this);
            } else {
              view = new ObjectNodeView(params, this);
            }
          } else {
            view = new ObjectView(params, this);
          }
          // TODO: отнаследовать от ObjectView вьюху для ArrayBuffer, тк там есть длина (), но она записана не в length,
          // а в byteLength
          view.stringTagName = stringTagName;
          return view;
        } else {
          return new PrimitiveView(params, this);
        }
      default:
        return new PrimitiveView(params, this);
    }
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
