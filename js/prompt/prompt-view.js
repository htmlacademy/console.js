import Misbehave from 'misbehave';
import Prism from 'prismjs';
import AbstractView from '../abstract-view';

const emptyRE = /^\n$/;

export default class PromptView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `\
<div class="prompt">\
  <div class="prompt__line-arrow"></div>
  <code class="prompt__input" contenteditable="true" autocapitalize="none" autocorrect="off" spellcheck="false" tabindex="0" role="textbox" aria-multiline="true"></code>\
  <a class="prompt__send-btn" aria-label="Выполнить">
    <svg class="prompt__send-icon send-icon send-icon--grey" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100">
      <circle class="send-icon__circle" r="50%" cx="50%" cy="50%" />
      <polyline points="55, 30 75, 50 55, 70" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="25" y1="50" x2="75" y2="50" stroke-width="7" stroke-linecap="round" />
    </svg>
  </a>\
</div>`;
  }

  _bind() {
    this._text = ``;
    this._inputEl = this.el.querySelector(`.prompt__input`);
    this._sendBtnEl = this.el.querySelector(`.prompt__send-btn`);
    this.editor = new Misbehave(this._inputEl, {
      oninput: this._handleMisbehaveInput.bind(this)
    });
    this._sendBtnEl.addEventListener(`click`, this._handleSendClick.bind(this));
    this._inputEl.addEventListener(`keydown`, this._handleKeyDown.bind(this));
  }

  _handleMisbehaveInput(text) {
    if (emptyRE.test(this._inputEl.innerText)) {
      this._inputEl.innerText = ``;
    } else {
      this._inputEl.innerHTML = Prism.highlight(text, Prism.languages.javascript);
    }
  }

  _handleKeyDown(evt) {
    if (!evt.shiftKey && evt.key === `Enter`) {
      this._send();
    }
  }

  _handleSendClick() {
    this._send();
  }

  _send() {
    this.onSend(this._inputEl.innerText);
    this._inputEl.innerText = ``;
  }

  onSend() {}
}
