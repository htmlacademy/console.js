/* eslint no-eval: "off" */
import PromptView from './prompt-view';

const globalNotStrictEval = eval; // Bypass strict mode with Indirect eval call!
export default class Prompt {
  constructor(container, cons, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._console = cons;
    this._container = container;

    this._view = new PromptView();
    this._view.onSend = this._handleSend.bind(this);
    this._container.appendChild(this._view.el);

    this._params = params;
  }

  _handleSend(code) {
    /* eslint no-new-func: "off" */
    // this._view.createScriptFromCodeAndAppend(code);
    const res = globalNotStrictEval(code);
    this._console.log(res);
  }
}
