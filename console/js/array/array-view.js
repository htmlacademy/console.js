import AbstractView from '../abstract-view';
import {getLoggedEl} from '../main';

export default class ArrayView extends AbstractView {
  constructor(arr, isInvokedInPreview = true, isOpened = false) {
    super();
    this._arr = arr;
    this._isInvokedInPreview = isInvokedInPreview;
    this._isOpened = isOpened;
  }

  get template() {
    if (this._isInvokedInPreview) {
      return `\
<div class="console__item array array_preview-size">\
  <div class="array__content">Array(${this._arr.length})</div>\
</div>`;
    } else {
      return `\
<div class="console__item array array_plain-preview ${this._isOpened ? `array_opened` : ``}">\
  <div class="array-open-brace">[</div>\
    <div class="array__content"></div>
  <div class="array-close-brace">]</div>\
</div>`;
    }
  }

  bind() {
    const arrayContent = this.el.querySelector('.array__content');
    if (!this._isInvokedInPreview) {
      for (const val of this._arr) {
        arrayContent.appendChild(getLoggedEl(val, true));
      }
    }
  }
}
