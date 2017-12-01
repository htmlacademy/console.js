import TypeView from '../type-view';
import {getLoggedEl} from '../main';

export default class ObjectView extends TypeView {
  constructor(val, isInvokedInPreview = true, isOpened = false) {
    super(val, 'object', false);
    this._isInvokedInPreview = isInvokedInPreview;
    this._isOpened = isOpened;
  }

  get template() {
    return `\
<div class="console__item object object_preview">\
  <div class="object-open-brace">{</div>\
    <div class="object__content"></div>\
  <div class="object-close-brace">}</div>\
</div>`;
  }

  bind() {
    const objectContent = this.el.querySelector('.object__content');
    if (!this._isInvokedInPreview) {
      for (const [key, val] of Object.entries(this._val)) {
        const keyEl = document.createElement('div');
        objectContent.appendChild(getLoggedEl(val, true), );
      }
    }
  }
}
