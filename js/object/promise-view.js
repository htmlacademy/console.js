import TypeView from '../type-view';
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
          this._createEntryEl({
            key: `<${this._promiseStatus}>`,
            el: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el,
            withoutValue: this._promiseStatus === PromiseStatus.pending,
            isGrey: true
          }),
          fragment
      );
    } else {
      TypeView.appendEntryElIntoFragment(
          this._createEntryEl({
            key: `[[PromiseStatus]]`,
            el: this._console.createTypedView(this._promiseStatus, mode, this.nextNestingLevel, this).el
          }),
          fragment
      );
      TypeView.appendEntryElIntoFragment(
          this._createEntryEl({
            key: `[[PromiseValue]]`,
            el: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el
          }),
          fragment
      );
    }
    return {fragment, isOversized};
  }
}
