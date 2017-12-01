import {getElement, getType} from './utils';
import ObjectView from './object/object-view';
import ArrayView from './array/array-view';
import FunctionView from './function/function-view';
import {getPrimitiveEl} from './primitive/primitive';

// export const getLoggedEl = (val, isInvokedInPreview) => {
//   let el;
//   const {type, isPrimitive} = getType(val);
//
//   if (isPrimitive) {
//     el = getPrimitiveEl(val, type);
//   } else {
//     if (type === 'function') {
//       el = new FunctionView(val, false).el;
//     } else if (type === 'array') {
//       el = new ArrayView(val, isInvokedInPreview).el;
//     } else if (type === 'object') {
//       el = new ObjectView(val, isInvokedInPreview).el;
//     }
//   }
// console.log(val, type, isPrimitive, el)
//   return el;
// };

const getRowEl = (entries, isError) => {
  var el = getElement('<div class="row"></div>');

  if (isError) {
    // el += printError(entries[0]);
  } else {
    entries.forEach(function (code, i) {
      if (code instanceof Error) {
        // el += printError(entries[0]);
      } else {
        el.appendChild(getLoggedEl(code, false).el);
      }
    });
  }
  console.log(el)

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
    throw Error('Console is not inited!');
  }

  // Public interface
  var logger = {};

  /**
   * Show formatted & highlighted code into `cont`
   */
  logger.log = function () {
    var args = Array.prototype.slice.call(arguments);

    cont.appendChild(getRowEl(args));

    if (typeof logger.onlog === 'function') {
      logger.onlog(args);
    }
  };

  logger.error = function (errorMessage) {
    cont.innerHTML += printEntries([errorMessage], true);
  };

  logger.clean = function () {
    cont.innerHTML = '';
  };

  logger.getLogSource = function () {
    return cont.innerHTML;
  };

  logger.logDeep = function (obj, level) {
    level = level || MAX_DEPTH_LEVEL;
    var oldLevel = MAX_DEPTH_LEVEL;
    try {
      MAX_DEPTH_LEVEL = level;
      logger.log(obj);
    } finally {
      MAX_DEPTH_LEVEL = oldLevel;
    }
  };

  logger.extend = function (consoleObject) {
    consoleObject.log = logger.log;
    consoleObject.info = logger.log;

    consoleObject.error = logger.error;
    consoleObject.warn = logger.error;

    consoleObject.dir = logger.logDeep;

    return consoleObject;
  };

  return logger;
};

window.jsConsoleInit = jsConsoleInit;
