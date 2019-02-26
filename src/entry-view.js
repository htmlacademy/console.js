import AbstractView from './abstract-view';
import {escapeHTML} from './utils';

export default class EntryView extends AbstractView {
  constructor({key, entryEl, mode, withoutKey, withoutValue, getViewEl, isGrey}) {
    super();
    this._key = key;
    this._entryEl = entryEl; // TODO не забыть поменять
    this._mode = mode;
    this._withoutKey = withoutKey;
    this._withoutValue = withoutValue;
    this._getViewEl = getViewEl;
    this._isGrey = isGrey;
  }

  get template() {
    return `<div class="entry-container__entry">${this._withoutKey ? `` :
      `<span class="entry-container__key ${this._withoutValue ? `` : `entry-container__key--with-colon`} ${this._isGrey ? `grey` : ``}">${escapeHTML(this._key.toString())}</span>`
    }${this._withoutValue ? `` :
      `<div class="entry-container__value-container ${this._entryEl ? `` : `entry-container__value-container--underscore`}">${this._entryEl ? `` : `(...)`}</div>`
    }</div>`;
  }

  _bind() {
    if (this._withoutValue) {
      return;
    }
    this._valueContEl = this._el.querySelector(`.entry-container__value-container`);

    if (this._entryEl) {
      this._valueContEl.appendChild(this._entryEl);
      return;
    }

    this._valueContEl.addEventListener(`click`, this._onClickInsertEl.bind(this), {
      once: true
    });
  }

  _onClickInsertEl(evt) {
    evt.preventDefault();

    this._valueContEl.textContent = ``;
    this._valueContEl.classList.remove(`entry-container__value-container--underscore`);

    try {
      const viewEl = this._getViewEl();
      this._valueContEl.appendChild(viewEl);
    } catch (err) {
      this._valueContEl.textContent = `[Exception: ${err.stack}]`;
    }
  }
}
