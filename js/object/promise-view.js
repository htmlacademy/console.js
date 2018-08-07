import TypeView from '../type-view';
import ObjectView from './object-view';
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
        if (this._console.checkInstanceOf(this._value, `Map`)) {
          const el = new MapEntryView({val: entry, mode, depth: this.nextNestingLevel, parentView: this, propKey: this._propKey}, this._console).el;
          entryEl = this._createEntryEl({key: i, el, withoutKey: true});
        }
        if (this._console.checkInstanceOf(this.value, `Set`)) {
          entryEl = this._createTypedEntryEl({obj: entriesArr, key: i, mode, withoutKey: true, notCheckDescriptors: true});
        }
        TypeView.appendEntryElIntoFragment(entryEl, fragment);
      }
    } else {
      const entriesList = entriesArr;
      // Object.setPrototypeOf(entriesList, null); // TODO удалить поле прото из этого объекта, но сделать так, чтобы показывало Array
      const entriesArrEl = this._console.createTypedView(entriesList, Mode.PROP, this.nextNestingLevel, this, `[[Entries]]`).el;
      TypeView.appendEntryElIntoFragment(
          this._createEntryEl({key: `[[Entries]]`, el: entriesArrEl, withoutKey: false}),
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
