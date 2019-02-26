import TypeView from '../type-view';
import EntryView from '../entry-view';
import ObjectView from './object-view';
import MapEntryView from '../object/map-entry-view';
import {Mode} from '../enums';

export default class MapSetView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  createContent(obj, inHead) {
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    let fragment;
    let isOversized = false;

    const maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
    // entries() for Map, values() for Set
    const entriesIterator = obj[Symbol.iterator]();
    const entriesArr = [...entriesIterator];

    if (inHead) {
      fragment = document.createDocumentFragment();

      for (let i = 0, l = entriesArr.length; i < l; i++) {
        if (i === maxFieldsInHead) {
          isOversized = true;
          break;
        }
        const entry = entriesArr[i];
        let entryEl;

        if (this._console.checkInstanceOf(this._value, `Map`)) {
          const el = new MapEntryView({val: entry, mode, depth: this.nextNestingLevel, parentView: this, propKey: this._propKey}, this._console).el;
          entryEl = new EntryView({key: i, entryEl: el, withoutKey: true}).el;
        }
        if (this._console.checkInstanceOf(this.value, `Set`)) {
          entryEl = this._createTypedEntryEl({obj: entriesArr, key: i, mode, withoutKey: true, notCheckDescriptors: true});
        }
        TypeView.appendEntryElIntoFragment(entryEl, fragment);
      }
    } else {
      const contentObj = ObjectView.prototype.createContent.apply(this, [obj, inHead]);
      fragment = contentObj.fragment;
      isOversized = contentObj.isOversized;

      // Object.setPrototypeOf(entriesArr, null); // TODO удалить поле прото из этого объекта, но сделать так, чтобы показывало Array
      const entriesArrView = this._console.createTypedView(entriesArr, Mode.PROP, this.nextNestingLevel, this, `[[Entries]]`);
      entriesArrView.isAutoExpandNeeded = true;
      TypeView.appendEntryElIntoFragment(
          new EntryView({key: `[[Entries]]`, entryEl: entriesArrView.el, withoutKey: false}).el,
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
