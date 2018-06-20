import AbstractView from '../abstract-view';
import {escapeHTML} from '../utils';

const emptyRE = /^\n$/;

export default class PromptView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `\
<div class="prompt">\
  <div class="prompt__line-arrow"></div>
  <div class="prompt__input" contenteditable="true" autocapitalize="none" tabindex="0" role="textbox" aria-multiline="true"></div>\
  <button class="prompt__send-btn round-btn round-btn--blue" aria-label="Выполнить">
    <svg class="prompt__send-icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 38 38">
      <polyline points="22, 4 36, 18 22, 32" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="2" y1="18" x2="34" y2="18" stroke="white" stroke-width="3" stroke-linecap="round" />
    </svg>
  </button>\
</div>`;
  }

  _bind() {
    this._inputEl = this.el.querySelector(`.prompt__input`);
    this._inputEl.addEventListener(`paste`, this._handlePaste.bind(this));
    this._inputEl.addEventListener(`input`, this._handleInput.bind(this));
  }

  _handlePaste(evt) {
    evt.preventDefault();

    const text = escapeHTML(evt.clipboardData.getData(`text`));
    const selection = window.getSelection();

    if (!selection.rangeCount) {
      return;
    }
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
  }

  _handleInput() {
    if (emptyRE.test(this._inputEl.innerText)) {
      this._inputEl.innerText = ``;
    }
  }
}
