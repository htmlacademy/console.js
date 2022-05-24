import ObjectView from './object-view';
import {Mode} from '../enums';
import NodeView from '../node/node-view';

export default class ObjectNodeView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  createContent(obj, inHead) {
    if (inHead) {
      const nodeView = new NodeView({val: this._value, mode: Mode.PREVIEW, depth: this.nextNestingLevel, parentView: this, propKey: this._propKey}, this._console);

      const fragment = document.createDocumentFragment();
      fragment.appendChild(nodeView.el);
      return {fragment};
    } else {
      const objContent = ObjectView.prototype.createContent.apply(this, [obj, inHead]);
      return objContent;
    }
  }
}
