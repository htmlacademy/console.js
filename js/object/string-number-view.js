import TypeView from '../type-view';
import ObjectView from './object-view';
import {Mode} from '../enums';

export default class StringNumberView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  /**
   * @override TypeView
   */
  get headContentEntriesKeys() {
    if (!this._headEntriesKeys) {
      this._headEntriesKeys = this._getEntriesKeys(true);

      if (this.value.length) {
        for (let i = 0; i < this.value.length; i++) {
          this._headEntriesKeys.delete(i.toString());
        }
        this._headEntriesKeys.delete(`length`);
      }
    }
    return this._headEntriesKeys;
  }

  createContent(obj, inHead) {
    const {fragment, isOversized} = ObjectView.prototype.createContent.apply(this, [obj, inHead]);

    const insertFn = inHead ? TypeView.prependEntryElIntoFragment : TypeView.appendEntryElIntoFragment;
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    if (this._console.checkInstanceOf(obj, `String`)) {
      const el = this._console.createTypedView(this._value.toString(), mode, this.nextNestingLevel, this).el;
      insertFn(
          this._createEntryEl({key: `[[PrimitiveValue]]`, el, withoutKey: inHead}),
          fragment
      );
    } else if (this._console.checkInstanceOf(obj, `Number`)) {
      const el = this._console.createTypedView(this._value * 1, mode, this.nextNestingLevel, this).el;
      insertFn(
          this._createEntryEl({key: `[[PrimitiveValue]]`, el, withoutKey: inHead}),
          fragment
      );
    }

    return {fragment, isOversized};
  }
}
