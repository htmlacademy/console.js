import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

export default class MapEntryView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this.rootView = this;
    }

    this._pairKey = this._value[0];
    this._pairValue = this._value[1];
  }
  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <div class="head__content map-pair hidden">\
      <span class="map-pair__key"></span> => <span class="map-pair__value"></span>\
    </div>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  _afterRender() {
    this._pairKeyEl = this._headContentEl.querySelector(`.map-pair__key`);
    this._pairValueEl = this._headContentEl.querySelector(`.map-pair__value`);
    this._state.isBraced = this._mode !== Mode.PREVIEW;
    this._state.isHeadContentShowed = true;
    this._state.isOpeningDisabled = this._mode === Mode.PREVIEW;
    this._state.isOpened = this._mode !== Mode.PREVIEW;
  }

  _getStateDescriptors() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && !self._pairKeyEl.innerHTML && !self._pairValueEl.innerHTML) {
          const keyEl = self._console.createTypedView(self._pairKey, self._mode, self.nextNestingLevel, self, self._propKey).el;
          const valueEl = self._console.createTypedView(self._pairValue, self._mode, self.nextNestingLevel, self, self._propKey).el;

          self._pairKeyEl.appendChild(keyEl);
          self._pairValueEl.appendChild(valueEl);
        }
        self._isHeadContentShowed = self.toggleHeadContentShowed(bool);
      },
      get isHeadContentShowed() {
        return self._isHeadContentShowed;
      },
      set isErrorEnabled(bool) {
        self._isErrorEnabled = self.toggleError(bool);
      },
      get isErrorEnabled() {
        return self._isErrorEnabled;
      }
    };
  }

  createContent() {
    const fragment = document.createDocumentFragment();

    const keyEl = this._console.createTypedView(this._pairKey, this._mode, this.nextNestingLevel, this, this._propKey).el;
    const valueEl = this._console.createTypedView(this._pairValue, this._mode, this.nextNestingLevel, this, this._propKey).el;

    TypeView.appendEntryElIntoFragment(
        this._createEntryEl({key: `key`, el: keyEl, withoutKey: false}),
        fragment
    );
    TypeView.appendEntryElIntoFragment(
        this._createEntryEl({key: `value`, el: valueEl, withoutKey: false}),
        fragment
    );

    return {fragment};
  }
}
