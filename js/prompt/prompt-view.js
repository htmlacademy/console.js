import AbstractView from '../abstract-view';
import {escapeHTML} from '../utils';

export default class PromptView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `\
<div class="prompt">\
  <div class="prompt__input" contenteditable="true" tabindex="0" role="textbox" aria-multiline="true"></div>\
  <button class="prompt__send" type="button" aria-label="Выполнить">></button>\
</div>`;
  }

  _bind() {
    this._input = this.el.querySelector(`.prompt__input`);
    this._input.addEventListener(`paste`, this._handlePaste);
    this._input.addEventListener(`input`, this._handleInput);
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

  _handleInput(evt) {

  }
}
