import ObjectView from './object/object-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import PrimitiveView from './primitive/primitive-view';
import {getElement} from './utils';
import {Mode, ViewType} from './enums';

/**
 * Console
 * @class
 */
export default class Console {
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
    this._views = new Map();
    this._container = container;
    const commonParams = this._parseParams(params.common);
    this.params = {
      object: this._parseParams(Object.assign({}, commonParams, params.object)),
      array: this._parseParams(Object.assign({}, commonParams, params.array)),
      function: this._parseParams(Object.assign({}, commonParams, params.function)),
      env: params.env
    };
  }

  _parseParams(paramsObject = {}) {
    // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0
    if (typeof paramsObject.expandDepth === `number` &&
    paramsObject.expandDepth > 0) {

      paramsObject.minFieldsToExpand = (
        typeof paramsObject.minFieldsToExpand === `number` &&
        paramsObject.minFieldsToExpand > 0
      ) ? paramsObject.minFieldsToExpand : 0;

      paramsObject.maxFieldsToExpand = (
        typeof paramsObject.maxFieldsToExpand === `number` &&
        paramsObject.maxFieldsToExpand > 0
      ) ? paramsObject.maxFieldsToExpand : Number.POSITIVE_INFINITY;
    }

    paramsObject.maxFieldsInHead = (
      typeof paramsObject.maxFieldsInHead === `number` &&
      paramsObject.maxFieldsInHead > 0
    ) ? paramsObject.maxFieldsInHead : Number.POSITIVE_INFINITY;

    if (!Array.isArray(paramsObject.excludeProperties)) {
      paramsObject.excludeProperties = [];
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

  createTypedView(val, mode, depth, parentView, propKey) {
    const params = {val, mode, depth, parentView, type: typeof val, propKey};
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
    // this._views.set(view.el, view);
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
