import TypeView from '../type-view';
import EntryView from '../entry-view';
import ObjectView from './object-view';
import {Mode} from '../enums';
import {getElement} from './utils';

const ContentType = {
  PROPERTIES: `properties`,
  NODES: `nodes`
};

export default class NodeView extends ObjectView {
  constructor(params, cons) {
    super(params, cons);
  }

  /**
   * @override
   */
  getHeadContent() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName#Value
    let val = ``;
    if (this._console.checkInstanceOf(this._value, `Element`)) {
      val = this._value.tagName.toLowerCase();
      if (this._value.id) {
        val += `#${this._value.id}`;
      }
      if (this._value.classList.length) {
        val += `.` + Array.prototype.join.call(this._value.classList, `.`);
      }
    } else if (this._console.checkInstanceOf(this._value, `DocumentFragment`)) {
      val = `#document-fragment`;
    } else if (this._console.checkInstanceOf(this._value, `Document`)) {
      val = `#document`;
    } else if (this._console.checkInstanceOf(this._value, `Text`)) {
      val = `#text`;
    } else if (this._console.checkInstanceOf(this._value, `Comment`)) {
      val = `#comment`;
    } else if (this._console.checkInstanceOf(this._value, `Attr`)) {
      val = this._value.name;
    } else {
      val = `not implemented`;
    }
    return val;
  }

  [getStateDescriptorsKey]() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && !self._headContentEl.innerHTML) {
          let fragment;
          if (self.contentType === ContentType.NODES) {

          } else {
            const obj = self.createContent(self.value, true);
            fragment = obj.fragment;
          }
          self._headContentEl.appendChild(fragment);
        }
        self._isHeadContentShowed = self.toggleHeadContentShowed(bool);
      },
      get isHeadContentShowed() {
        return self._isHeadContentShowed;
      },
      set isContentShowed(bool) {
        if (bool === self._isContentShowed) {
          return;
        }
        self._isContentShowed = self.toggleContentShowed(bool);
        if (self._isContentShowed && self._contentEl.childElementCount === 0) {
          self._contentEl.appendChild(self.createNodeContent(self._value).fragment);
        }
      },
      get isContentShowed() {
        return self._isContentShowed;
      },
      set isErrorEnabled(bool) {
        self._isErrorEnabled = self.toggleError(bool);
      },
      get isErrorEnabled() {
        return self._isErrorEnabled;
      },
      set isOpened(bool) {
        if (bool === self._isOpened) {
          return;
        }

        self._isOpened = bool;
        self.toggleArrowBottom(bool);
        self._state.isContentShowed = bool;

        self._state.isHeadContentShowed = self.isShowHeadContent;
        self._state.isShowInfo = self.isShowInfo;
      },
      get isOpened() {
        return self._isOpened;
      }
    };
  }

  get contentType() {
    if (!this._cache.contentType) {
      this._cache.contentType = this._mode === Mode.LOG ||
        this._mode === Mode.LOG_HTML ||
        this._mode === Mode.ERROR ?
        ContentType.NODES : ContentType.PROPERTIES;
    }
    return this._cache.contentType;
  }

  createContent(node, inHead) {
    const fragment = document.createDocumentFragment();

    const nodes = Array.from(node.childNodes);
    for (let _node of nodes) {

    }

    return {fragment, isOversized};
  }
}
