import PromptView from './prompt-view';

export default class Prompt {
  constructor(container, createProxyFrame, consoleObject, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._view = new PromptView();
    this._view.onSend = this._handleSend.bind(this);
    this._container = container;
    this._container.appendChild(this._view.el);
    this._params = params;

    this._createProxyFrame = createProxyFrame;
    if (this._createProxyFrame) {
      this._createFrame();
    }
    this._createElForScripts();
  }

  set consoleObject(val) {
    this._consoleObject = val;
    this.usedWindow.console = this._consoleObject;
  }

  get usedWindow() {
    return this._createProxyFrame ? this._frame.contentWindow : window;
  }

  _createFrame() {
    this._frame = document.createElement(`iframe`);
    this._frame.width = this._frame.height = 1;
    this._frame.style.opacity = 0;
    this._frame.style.border = 0;
    this._frame.style.position = `absolute`;
    this._frame.style.top = `-100px`;
    document.body.appendChild(this._frame);
  }

  _createElForScripts() {
    this._scriptsEl = this.usedWindow.document.createElement(`div`);
    this.usedWindow.document.body.appendChild(this._scriptsEl);
  }

  _handleSend(code) {
    const doc = this.usedWindow.document;
    const script = doc.createElement(`script`);
    const blob = new Blob([code], {
      type: `application/javascript`,
    });
    script.src = URL.createObjectURL(blob);
    const res = this.usedWindow.eval(code);
    this._consoleObject.log(res);
    this._scriptsEl.appendChild(script);
    this._scriptsEl.removeChild(script);
  }
}
