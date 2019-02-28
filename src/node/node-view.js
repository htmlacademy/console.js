import {ViewType, GET_STATE_DESCRIPTORS_KEY_NAME, Mode} from '../enums';
import BaseView from '../base-view';
import {escapeHTML} from '../utils';

const elsWithoutEndTag = [`input`, `br`, `hr`, `img`, `base`, `link`, `meta`, `wbr`, `source`, `embed`, `param`, `track`, `area`, `col`];

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
    <div class="head__content tag-pair hidden"><span class="tag-pair__opening">${escapeHTML(this._getMainHeadContent())}</span><span class="tag-pair__rest hidden">${escapeHTML(this._getRestHeadContent())}</span></div>\
  </div>
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>
</div>`;
  }

  _afterRender() {
    this._tagContentEl = this._headContentEl.querySelector(`.tag-pair__content`);
    this._tagRestContentEl = this._headContentEl.querySelector(`.tag-pair__rest`);

    this._state.isHeadContentShowed = true;
    this._state.isRestHeadContentShowed = this.isShowRestHeadContent;
    this._state.isOpeningDisabled = this.isDisableOpening;

    this._state.isOpened = this.isOpeningAllowed;
  }

  [getStateDescriptorsKey]() {
    const self = this;
    return {
      set isRestHeadContentShowed(bool) {
        self._isRestHeadContentShowed = !self._tagRestContentEl.classList.toggle(`hidden`, !bool);
      },
      get isRestHeadContentShowed() {
        return self._isRestHeadContentShowed;
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
        self._state.isRestHeadContentShowed = self.isShowRestHeadContent;
      },
      get isOpened() {
        return self._isOpened;
      }
    };
  }

  get isShowRestHeadContent() {
    return this._contentType === ContentType.NODES && !this._state.isOpened;
  }

  get isDisableOpening() {
    if (!(this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR || this._mode === Mode.PREVIEW)) {
      throw new Error(`NodeView must be created with mode LOG, LOG_HTML, ERROR or PREVIEW`);
    }

    if (this._mode === Mode.PREVIEW) {
      return true;
    }

    const nt = this._value.nodeType;
    if (nt === Node.ELEMENT_NODE || nt === Node.DOCUMENT_NODE || nt === Node.DOCUMENT_FRAGMENT_NODE || nt === Node.DOCUMENT_TYPE_NODE) {
      return false;
    }

    return true;
  }

  /**
   * Возвращает строку контента ноды. Если это Элемент — первый, открывающий, тег.
   * @return {string}
   */
  _getMainHeadContent() {
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
    if (v.nodeType === Node.ELEMENT_NODE) {
      const attrs = getElementAttributesStr(v);
      val = `<${v.tagName.toLowerCase()}${attrs ? ` ${attrs}` : ``}>`;
    } else if (v.nodeType === Node.TEXT_NODE) {
      val = v.data;
    } else if (v.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      val = `#document-fragment`;
    } else if (v.nodeType === Node.DOCUMENT_NODE) {
      val = `#document`;
    } else if (v.nodeType === Node.COMMENT_NODE) {
      val = `<!-- ${v.data} -->`;
    } else if (v.nodeType === Node.ATTRIBUTE_NODE) {
      val = v.name;
    } else if (v.nodeType === Node.DOCUMENT_TYPE_NODE) {
      val = `<!DOCTYPE html>`;
    } else {
      val = `not implemented`;
    }
    return val;
  }

  _getHeadPropertiesContent(v) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName#Value
    let val;
    if (v.nodeType === Node.ELEMENT_NODE) {
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
  _getRestHeadContent() {
    if (this._value.nodeType === Node.ELEMENT_NODE) {
      let content = ``;
      if (!checkElementIsEmpty(this._value) && !this._console.checkInstanceOf(this._value, `HTMLTemplateElement`)) {
        if (this._value.innerHTML.length > MAX_PREVIEW_CONTENT_LENGTH) {
          content = `…`;
        } else {
          content = this._value.innerHTML;
        }
      }

      let closingTag = ``;
      const tagNameLower = this._value.tagName.toLowerCase();
      if (content || !elsWithoutEndTag.includes(tagNameLower)) {
        closingTag = `</${tagNameLower}>`;
      }
      return `${content}${closingTag}`;
    } else if (this._value.nodeType === Node.ATTRIBUTE_NODE) {
      const attrValue = this._value.value;
      return attrValue ? `="${attrValue}"` : ``;
    }
    return ``;
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
