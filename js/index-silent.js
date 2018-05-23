import Console from './main';
import mergeWith from 'lodash.mergewith';
import {customizer} from './utils';

const CSS_URL = `//htmlacademy.github.io/console.js/0.2.0/css/style.min.css`;

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
  let config;
  if (Array.isArray(window.jsConsolePresets)) {
    config = mergeWith({}, ...window.jsConsolePresets.slice().reverse(), customizer);
  }
  const jsConsole = new Console(div, config);
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

window.addEventListener(`DOMContentLoaded`, () => {
  const link = window.document.createElement(`link`);
  link.rel = `stylesheet`;
  link.href = CSS_URL;
  link.addEventListener(`load`, () => {
    init();
  });
  window.document.head.appendChild(link);
});
