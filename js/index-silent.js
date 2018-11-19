/* eslint no-invalid-this: "off"*/
import Console from './console';
import {Mode} from './enums';

const CSS_URL = `//htmlacademy.github.io/console.js/1.0.0/css/style.min.css`;

const messages = [];

const collectErr = function (evt) {
  messages.push({mode: Mode.ERROR, args: [evt.error ? evt.error : evt.message]});
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

let container = null;

const init = function () {
  container = window.document.createElement(`div`);
  container.classList.add(`console-container`);
  const jsConsole = new Console(container);
  window.jsConsole = jsConsole;

  jsConsole.extend(window.console);
};

const processMessages = () => {
  messages.forEach(({mode, args}) => {
    switch (mode) {
      case Mode.LOG:
        window.jsConsole.log(...args);
        break;
      case Mode.DIR:
        window.jsConsole.dir(...args);
        break;
      case Mode.LOG_HTML:
        window.jsConsole.logHTML(...args);
        break;
      case Mode.ERROR:
        window.jsConsole.error(...args);
        break;
    }
  });
  window.removeEventListener(`error`, collectErr);
  window.addEventListener(`error`, (evt) => {
    window.jsConsole.error(evt.error ? evt.error : evt.message);
  });
};

window.addEventListener(`DOMContentLoaded`, () => {
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  const link = window.document.createElement(`link`);
  link.rel = `stylesheet`;
  link.href = CSS_URL;
  link.addEventListener(`load`, () => {
    // init();
    processMessages();
    window.document.body.appendChild(container);
  });
  window.document.head.appendChild(link);
});

init();
