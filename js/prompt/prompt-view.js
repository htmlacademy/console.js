import Misbehave from 'misbehave';
import Prism from 'prismjs';
import AbstractView from '../abstract-view';

const emtyRE = /^\n{0,2}$/;

export default class PromptView extends AbstractView {
  constructor(isMobile) {
    super();
    this._isMobile = isMobile;
  }

  get template() {
    return `\
<div class="prompt">
  <div class="prompt__line-arrow"></div>
  <code class="prompt__input" contenteditable="true" autocapitalize="none" autocorrect="off" spellcheck="false" tabindex="0" role="textbox" aria-multiline="true"></code>
  <a class="prompt__send-btn" aria-label="Выполнить">
    <svg class="prompt__send-icon send-icon send-icon--grey" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100">
      <circle class="send-icon__circle" r="50%" cx="50%" cy="50%" />
      <polyline points="55, 30 75, 50 55, 70" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="25" y1="50" x2="75" y2="50" stroke-width="7" stroke-linecap="round" />
    </svg>
  </a>
  <div class="prompt__scripts"></div>
</div>`;
  }

  _bind() {
    this._text = ``;
    this._allowSend = false;
    this._scriptsEl = this.el.querySelector(`.prompt__scripts`);
    this._inputEl = this.el.querySelector(`.prompt__input`);
    this._sendBtnEl = this.el.querySelector(`.prompt__send-btn`);

    this._sendBtnEl.addEventListener(`click`, this._handleSendClick.bind(this));
    this._inputEl.addEventListener(`keydown`, this._handleKeyDown.bind(this));
    this._sendBtnEl.addEventListener(`mousedown`, this._handleMouseDown.bind(this));
    this.editor = new Misbehave(this._inputEl, {
      oninput: this._handleMisbehaveInput.bind(this)
    });
  }

  get height() {
    return this._el.offsetHeight;
  }

  _handleMisbehaveInput(text) {
    if (emtyRE.test(text)) {
      this._inputEl.innerText = ``;
    } else {
      this._inputEl.innerHTML = Prism.highlight(text, Prism.languages.javascript);
    }
  }

  _handleKeyDown(evt) {
    if (!this._isMobile && !evt.shiftKey && evt.key === `Enter`) {
      this._send();
    }
  }

  _handleSendClick() {
    this._send();
  }

  _handleMouseDown(evt) {
    evt.preventDefault();
  }

  _send() {
    if (this._inputEl.innerText) {
      this.onSend(this._inputEl.innerText, this._inputEl.innerHTML);
      this._inputEl.innerText = ``;
    }
  }

  onSend() {}

  createScriptFromCodeAndAppend(code, cb = () => {}) {
    const script = document.createElement(`script`);
    const blob = new Blob([code], {
      type: `application/javascript`,
    });
    script.src = URL.createObjectURL(blob);
    script.onload = () => {
      this._scriptsEl.removeChild(script);
      cb();
    };
    this._scriptsEl.appendChild(script);
  }
}
