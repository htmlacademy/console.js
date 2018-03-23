import ObjectView from './object/object-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import PrimitiveView from './primitive/primitive-view';
import {getElement} from './utils';
import {Mode} from './enums';

/**
 * Console
 * @class
 */
export default class Console {
  /**
   * Initialize console into container
   * @param {HTMLElement} container — console container
   * @param {{}} params — parameters
   * @property {number} params.expandFields — min number of fields in obj to expand
   * @property {number} params.expandDepth — level of depth to expand
   **/
  constructor(container, params) {
    if (!container) {
      throw new Error(`Console is not inited!`);
    }
    this._container = container;
    if (params &&
    typeof params.expandFields === `number` &&
    typeof params.expandDepth === `number`) {
      this._expandFields = params.expandFields;
      this._expandDepth = params.expandDepth;
    }
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

  createTypedView(val, mode) {
    const params = {val, mode, type: typeof val};
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
