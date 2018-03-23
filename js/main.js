// import babelPolyfill from 'babel-polyfill';
// import whatwgFetch from 'whatwg-fetch';
import {getElement, createTypedView} from './utils';

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
const jsConsoleInit = (cont) => {
  if (!cont) {
    throw Error(`Console is not inited!`);
  }

  // Public interface
  const logger = {};

  /**
   * Show formatted & highlighted code into `cont`
   */
  logger.log = function (...rest) {
    cont.appendChild(getRowEl(rest, Mode.LOG));

    if (typeof logger.onlog === `function`) {
      logger.onlog(rest);
    }
  };

  logger.error = function (errOrSmth) {
    const el = getElement(`<div class="console__row console__row_error"></div>`);
    el.appendChild(createTypedView(errOrSmth, Mode.ERROR).el);
    cont.appendChild(el);
  };

  logger.clean = function () {
    cont.innerHTML = ``;
  };

  logger.getLogSource = function () {
    return cont.innerHTML;
  };

  logger.dir = function (val) {
    const el = getElement(`<div class="console__row"></div>`);
    el.appendChild(createTypedView(val, Mode.DIR).el);
    cont.appendChild(el);
  };

  logger.extend = function (consoleObject) {
    consoleObject.log = logger.log;
    consoleObject.info = logger.log;

    consoleObject.error = logger.error;
    consoleObject.warn = logger.error;

    consoleObject.dir = logger.dir;

    return consoleObject;
  };

  return logger;
};

export default jsConsoleInit;
