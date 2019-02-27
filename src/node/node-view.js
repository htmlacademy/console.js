import {ViewType, GET_STATE_DESCRIPTORS_KEY_NAME, Mode} from '../enums';
import BaseView from '../base-view';

const MAX_PREVIEW_CONTENT_LENGTH = 43;

const ContentType = {
  PROPERTIES: `properties`,
  NODES: `nodes`
};

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

const getElementAttributesStr = (el) => (
  Array.from(el.attributes)
    .map(({name, value}) => `${name}="${value}"`)
    .join(` `)
);

const checkElementIsEmpty = (el) => !(
  el.textContent.trim() ||
  el.childNodes.length ||
  el.content
);

export default class NodeView extends BaseView {
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
    <div class="head__content tag-pair hidden"><!--
    --><span class="tag-pair__opening">${this._getMainHeadContent()}</span><span class="tag-pair__rest"></span><!--
 --></div>\
  </div>
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>
</div>`;
  }

  _afterRender() {
    this._tagContentEl = this._headContentEl.querySelector(`.tag-pair__content`);
    this._tagOpeningEl = this._headContentEl.querySelector(`.tag-pair__opening`);
    this._tagClosingEl = this._headContentEl.querySelector(`.tag-pair__closing`);

    this._state.isHeadContentShowed = true;
    this._state.isOpeningDisabled = this._mode !== Mode.PREVIEW;

    this._state.isOpened = this.isOpeningAllowed;
  }

  [getStateDescriptorsKey]() {
    const self = this;
    return {
      set isHeadContentShowed(bool) {
        if (bool && !self._headContentEl.innerHTML) {
          self._tagContentEl.innerHTML =
          self._tagOpeningEl.innerHTML =
          self._tagClosingEl.innerHTML =
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

  /**
   * Возвращает строку контента ноды. Если это Элемент — первый, открывающий, тег.
   * @param {ContentType} type
   * @return {string}
   */
  _getMainHeadContent(type) {
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
      val = `<${v.tagName.toLowerCase()} ${getElementAttributesStr(v)}>`;
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
    } else {
      val = v.nodeName;
    }
    return val;
  }

  /**
   * Возвращает остальную строку контента ноды.
   * Если это элемент — текст после открывающего тега (если там он есть) и закрывающий тег
   * Если не элемент — пустую строку
   * @param {ContentType} type
   * @return {string}
   */
  _getOtherHeadContent() {
    let val = ``;
    if (this._contentType === ContentType.NODES && this._console.checkInstanceOf(this._value, `Element`)) {
      let content = ``;
      if (!checkElementIsEmpty(v) && !this._console.checkInstanceOf(this._value, `HTMLTemplateElement`)) {
        if (v.innerHTML.length > MAX_PREVIEW_CONTENT_LENGTH) {
          content = `…`
        } else {
          content = v.innerHTML;
        }
      }


      val = `${!checkElementIsEmpty(v) || this._value.innerHTML.length > MAX_PREVIEW_CONTENT_LENGTH ? `…` : ``}<${v.tagName.toLowerCase()}>`
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

  createContent(obj, inHead) {
    const fragment = document.createDocumentFragment();

    const mode = inHead ? Mode.PREVIEW : Mode.PROP;

    const keyEl = this._console.createTypedView(this._pairKey, this._mode, this.nextNestingLevel, this, this._propKey).el;
    return {fragment, isOversized};
  }
}
