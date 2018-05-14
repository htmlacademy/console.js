import {getElement} from './utils';

export default class AbstractView {
  constructor() {}

  /**
   * @abstract
   * @return {string}
   */
  get template() {}

  /**
   * @return {HTMLElement}
   */
  get el() {
    if (!this._el) {
      this._el = this._render();
      this._bind(this._el);
    }
    return this._el;
  }

  /**
   * Renders element from this.template
   * @private
   * @return {HTMLElement}
   */
  _render() {
    return getElement(this.template);
  }

  /**
   * Method to work with element after render
   * @protected
   */
  _bind() {}
}
