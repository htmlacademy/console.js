import PromptView from './prompt-view';

export default class Prompt {
  constructor(container, consoleObject, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    // this._consoleObject = consoleObject;
    this._view = new PromptView();
    this._view.handleSubmit = this._onSubmit.bind(this);
    this._container = container;
    this._container.appendChild(this._view.el);
    this._params = params;

    this._createFrame();
  }

  set consoleObject(val) {
    this._consoleObject = val;
  }

  get frameWindow() {
    return this._frame.contentWindow;
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

  _onSubmit(code) {
    const win = this._frame.contentWindow;
    win.console = this._consoleObject;
    const doc = win.document;
    const script = doc.createElement(`script`);
    const blob = new Blob([code], {
      type: `application/javascript`,
    });
    script.src = URL.createObjectURL(blob);
    const res = win.eval(code);
    this._consoleObject.log(res);
    if (res !== void 0) {
      doc.body.appendChild(script);
    }
  }
}
