import TypeView from '../type-view';
import ObjectView from './object-view';
import {getElement} from '../utils';
import {Mode} from '../enums';

export default class MapSetView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  createContent(obj, inHead) {
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    let fragment;
    let isOversized = false;
    if (!inHead) {
      const contentObj = ObjectView.prototype.createContent.apply(this, [obj, inHead]);
      fragment = contentObj.fragment;
      isOversized = contentObj.isOversized;
    } else {
      fragment = document.createDocumentFragment();
    }

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    // entries() for Map, values() for Set
    const entriesIterator = obj[Symbol.iterator]();
    const entriesArr = [...entriesIterator];
    if (inHead) {
      for (let i = 0, l = entriesArr.length; i < l; i++) {
        if (i === maxFieldsInHead) {
          isOversized = true;
          break;
        }
        const entry = entriesArr[i];
        let entryEl;
        if (this._value instanceof Map) {
          const [entryKey, entryValue] = entry;
          entryEl = this.createMapEntryEl({key: i, entryKey, entryValue, mode, withoutKey: true});
        }
        if (this.value instanceof Set) {
          entryEl = this._createTypedEntryEl({obj: entriesArr, key: i, mode, withoutKey: true, notCheckDescriptors: true});
        }
        TypeView.appendEntryElIntoFragment(entryEl, fragment);
      }
    } else {
      const entriesArrEl = this._console.createTypedView(entriesArr, Mode.PROP, this.nextNestingLevel, this, `[[Entries]]`).el;
      TypeView.appendEntryElIntoFragment(
          this._createEntryEl({key: `[[Entries]]`, el: entriesArrEl, withoutKey: false, isGrey: true}),
          fragment
      );
    }
    return {fragment, isOversized};
  }

  createMapEntryEl({key, entryKey, entryValue, mode, withoutKey = false}) {
    const keyEl = this._console.createTypedView(entryKey, mode, this.nextNestingLevel, this, key).el;
    const valueEl = this._console.createTypedView(entryValue, mode, this.nextNestingLevel, this, key).el;

    const mapPairEl = getElement(`\
<span class="map-pair">\
  <span class="map-pair__key"></span> => <span class="map-pair__value"></span>\
</span>`);

    mapPairEl.querySelector(`.map-pair__key`).appendChild(keyEl);
    mapPairEl.querySelector(`.map-pair__value`).appendChild(valueEl);

    return this._createEntryEl({key, el: mapPairEl, withoutKey});
  }
}
