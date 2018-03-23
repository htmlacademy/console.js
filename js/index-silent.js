import Console from './main';

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
