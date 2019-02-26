import {ViewType, GET_STATE_DESCRIPTORS_KEY_NAME, Mode} from '../enums';
import TypeView from '../type-view';

const ContentType = {
  PROPERTIES: `properties`,
  NODES: `nodes`
};

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

const getElementAttributesStr = (el) => Array.from(el.attributes)
  .map(({name, value}) => `${name}="${value}"`).join(` `);

const checkElementIsEmpty = (el) => !(
  el.textContent.trim() ||
  el.children.length ||
  el.content
);

export default class NodeView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.NODE;
    this._viewTypeParams = this._console.params[this.viewType];
    if (!params.parentView) {
      this.rootView = this;
    }
    this._contentType = this._getContentType();
    this._stateDescriptorsQueue.push(this[getStateDescriptorsKey]());
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">
  <div class="head item__head">
    <div class="head__content hidden">${this._getHeadContent()}</div>
  </div>
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>
</div>`;
  }

  _afterRender() {
    if (this.headContentClassName) {
      this._headContentEl.classList.add(this.headContentClassName);
    }

    this._state.isShowInfo = this.isShowInfo;
    this._state.isBraced = this.isShowBraces;
    this._state.isHeadContentShowed = this.isShowHeadContent;
    this._state.isOpeningDisabled = this.isDisableOpening;
    this._state.isItalicEnabled = this.isEnableItalic;
    this._state.isErrorEnabled = this.isEnableError;
    this._state.isOversized = this.isEnableOversized;

    this._state.isOpened = this.isOpeningAllowed;
  }

  _getHeadContent() {
    let val;
    switch (this._contentType) {
      case ContentType.NODES:
        val = this._getHeadNodesContent(this._value);
        break;
      case ContentType.PROPERTIES:
        val = this._getHeadPropertiesContent(this._value);
        break;
    }
    return val;
  }

  _getHeadNodesContent(v) {
    let val;
    if (this._console.checkInstanceOf(v, `Element`)) {
      val = `<${v.tagName.toLowerCase()} ${getElementAttributesStr(v)}>${checkElementIsEmpty(v) ? `` : `…`}<${v.tagName.toLowerCase()}>`;
    } else if (this._console.checkInstanceOf(v, `DocumentFragment`)) {
      val = `#document-fragment`;
    } else if (this._console.checkInstanceOf(v, `Document`)) {
      val = `#document`;
    } else if (this._console.checkInstanceOf(v, `Text`)) {
      val = v.data;
    } else if (this._console.checkInstanceOf(v, `Comment`)) {
      val = `<!--${v.data}-->`;
    } else if (this._console.checkInstanceOf(v, `Attr`)) {
      val = v.name;
    } else {
      val = `not implemented`;
    }
    return val;
  }

  _getHeadPropertiesContent(v) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName#Value
    let val;
    if (this._console.checkInstanceOf(v, `Element`)) {
      val = v.tagName.toLowerCase();
      if (v.id) {
        val += `#${v.id}`;
      }
      if (v.classList.length) {
        val += `.` + Array.prototype.join.call(v.classList, `.`);
      }
    } else if (this._console.checkInstanceOf(v, `DocumentFragment`)) {
      val = `#document-fragment`;
    } else if (this._console.checkInstanceOf(v, `Document`)) {
      val = `#document`;
    } else if (this._console.checkInstanceOf(v, `Text`)) {
      val = `#text`;
    } else if (this._console.checkInstanceOf(v, `Comment`)) {
      val = `#comment`;
    } else if (this._console.checkInstanceOf(v, `Attr`)) {
      val = v.name;
    } else {
      val = `not implemented`;
    }
    return val;
  }

  _getContentType() {
    return (
      this._mode === Mode.LOG ||
      this._mode === Mode.LOG_HTML ||
      this._mode === Mode.ERROR
    ) ? ContentType.NODES : ContentType.PROPERTIES;
  }
}
