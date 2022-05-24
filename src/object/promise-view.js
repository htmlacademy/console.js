import TypeView from '../type-view';
import EntryView from '../entry-view';
import ObjectView from './object-view';
import {Mode, PromiseStatus} from '../enums';

export default class PromiseView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  _afterRender() {
    this.getPromiseStatus().then(({value, status}) => {
      this._promiseValue = value;
      this._promiseStatus = status;
      ObjectView.prototype._afterRender.call(this);
    });
  }

  getPromiseStatus() {
    const obj = {};
    return Promise.race([this.value, obj])
      .then((val) => {
        let status;
        let value;
        if (val === obj) {
          status = PromiseStatus.pending;
        } else {
          status = PromiseStatus.resolved;
          value = val;
        }
        return {status, value};
      })
      .catch((val) => ({status: PromiseStatus.rejected, value: val}));
  }

  createContent(obj, inHead) {
    const {fragment, isOversized} = ObjectView.prototype.createContent.apply(this, [obj, inHead]);
    const mode = inHead ? Mode.PREVIEW : Mode.PROP;
    if (inHead) {
      TypeView.prependEntryElIntoFragment(
          new EntryView({
            key: `<${this._promiseStatus}>`,
            entryEl: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el,
            withoutValue: this._promiseStatus === PromiseStatus.pending,
            isGrey: true
          }).el,
          fragment
      );
    } else {
      TypeView.appendEntryElIntoFragment(
          new EntryView({
            key: `[[PromiseStatus]]`,
            entryEl: this._console.createTypedView(this._promiseStatus, mode, this.nextNestingLevel, this).el
          }).el,
          fragment
      );
      TypeView.appendEntryElIntoFragment(
          new EntryView({
            key: `[[PromiseValue]]`,
            entryEl: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el
          }).el,
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
