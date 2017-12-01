import AbstractView from '../abstract-view';
import {getLoggedEl} from '../main';

export default class FunctionView extends AbstractView {
  constructor(fn, isOpened = false) {
    super();
    this._fn = fn;
    this._isOpened = isOpened;
  }

  get template() {
    return `<div class="console__item function"><div class="function__content">f</div></div>`
  }

  bind() {

  }
}
