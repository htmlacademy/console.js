import jsConsoleInit from './main';

const CSS_URL = `//htmlacademy.github.io/console.js/css/style.css`;

const errors = [];
const collectErr = function (...rest) {
  errors.push(rest);
};
window.onerror = collectErr;
window.console.warn = collectErr;
window.console.error = collectErr;

const messages = [];
const collectMsg = function (...rest) {
  messages.push(...rest);
};
window.console.info = collectMsg;
window.console.log = collectMsg;
window.console.debug = collectMsg;

const init = function () {
  const div = window.document.createElement(`div`);
  const jsConsole = jsConsoleInit(div);
  window.document.body.appendChild(div);

  jsConsole.extend(window.console);

  errors.forEach(function (args) {
    jsConsole.error(jsConsole, ...args);
  });
  messages.forEach(function (args) {
    jsConsole.log(jsConsole, ...args);
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
