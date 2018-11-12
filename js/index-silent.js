/* eslint no-invalid-this: "off"*/
import Console from './console';
import mergeWith from 'lodash.mergewith';
import {customizer} from './utils';
import {Mode} from './enums';

const CSS_URL = `//htmlacademy.github.io/console.js/0.4.1/css/style.min.css`;

const messages = [];

const collectErr = function (evt) {
  messages.push({mode: Mode.ERROR, args: [evt.error]});
};

window.addEventListener(`error`, collectErr);

const collectMessages = function (...args) {
  messages.push({mode: this.mode, args});
};

window.console.info = collectMessages.bind({mode: Mode.LOG});
window.console.log = collectMessages.bind({mode: Mode.LOG});
window.console.logHTML = collectMessages.bind({mode: Mode.LOG_HTML});
window.console.dir = collectMessages.bind({mode: Mode.DIR});
window.console.warn = collectMessages.bind({mode: Mode.ERROR});
window.console.error = collectMessages.bind({mode: Mode.ERROR});

const init = function () {
  const div = window.document.createElement(`div`);
  div.classList.add(`console-container`);
  let config;
  if (Array.isArray(window.jsConsolePresets)) {
    config = mergeWith({}, ...window.jsConsolePresets.slice().reverse(), customizer);
  } else {
    window.jsConsolePresets = [];
  }
  const jsConsole = new Console(div, config);
  window.document.body.appendChild(div);

  jsConsole.extend(window.console);
  messages.forEach(({mode, args}) => {
    switch (mode) {
      case Mode.LOG:
        jsConsole.log(...args);
        break;
      case Mode.DIR:
        jsConsole.dir(...args);
        break;
      case Mode.LOG_HTML:
        jsConsole.logHTML(...args);
        break;
      case Mode.ERROR:
        jsConsole.error(...args);
        break;
    }
  });
  window.addEventListener(`error`, (evt) => {
    jsConsole.error(evt.error);
  });
};

window.addEventListener(`DOMContentLoaded`, () => {
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  const link = window.document.createElement(`link`);
  link.rel = `stylesheet`;
  link.href = CSS_URL;
  link.addEventListener(`load`, () => {
    init();
  });
  window.document.head.appendChild(link);
});
