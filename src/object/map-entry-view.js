import TypeView from '../type-view';
import EntryView from '../entry-view';
import {Mode, ViewType, GET_STATE_DESCRIPTORS_KEY_NAME} from '../enums';

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

export default class MapEntryView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.OBJECT;
    if (!params.parentView) {
      this.rootView = this;
    }

    this._pairKey = this._value[0];
    this._pairValue = this._value[1];

    this._stateDescriptorsQueue.push(this[getStateDescriptorsKey]());
  }
  get template() {
    return `\
<div class="console__item item item--${this.viewType}">\
  <div class="head item__head">\
    <div class="head__content entry-container entry-container--${this.viewType} map-pair hidden"><!--
    --><span class="map-pair__key"></span> => <span class="map-pair__value"></span><!--
 --></div>\
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
    this._state.isOpened = this.isOpeningAllowed;
  }

  [getStateDescriptorsKey]() {
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
        new EntryView({key: `key`, entryEl: keyEl, withoutKey: false}).el,
        fragment
    );
    TypeView.appendEntryElIntoFragment(
        new EntryView({key: `value`, entryEl: valueEl, withoutKey: false}).el,
        fragment
    );

    return {fragment};
  }
}
