import PromptView from './prompt-view';

export default class Prompt {
  constructor(container, consoleObject, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._view = new PromptView();
    this._container = container;
    this._container.appendChild(this._view.el);
    this._params = params;
  }
}
