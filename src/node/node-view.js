import {ViewType, GET_STATE_DESCRIPTORS_KEY_NAME, Mode} from '../enums';
import BaseView from '../base-view';
import EntryView from '../entry-view';
import {escapeHTML, getElement} from '../utils';

const ELS_WITHOUT_ENDING_TAG = [`input`, `br`, `hr`, `img`, `base`, `link`, `meta`, `wbr`, `source`, `embed`, `param`, `track`, `area`, `col`];

const MAX_PREVIEW_CONTENT_LENGTH = 43;

const ContentType = {
  PLAIN: `plain`,
  NODES: `nodes`
};

const getStateDescriptorsKey = Symbol(GET_STATE_DESCRIPTORS_KEY_NAME);

const getElementAttributesStr = (el) => (
  Array.from(el.attributes)
    .map(({name, value}) => `<span class="c-html__attr-name">${name}=</span>&quot;<span class="c-html__attr-value">${value}</span>&quot;`)
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

    this._stateDescriptorsQueue.push(this[getStateDescriptorsKey]());
  }

  get template() {
    return `\
<div class="console__item item item--${this.viewType}">
  <div class="head item__head">
    <div class="head__content c-html tag-pair hidden"><span class="tag-pair__opening">${this._getMainHeadContent()}</span><span class="tag-pair__rest hidden">${this._getRestHeadContent()}</span></div>\
  </div>
  <div class="item__content c-html entry-container entry-container--${this.viewType} hidden"></div>
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
    return this._mode !== Mode.PREVIEW && !this._state.isOpened;
  }

  get isDisableOpening() {
    if (this._mode === Mode.PREVIEW) {
      return true;
    }

    if (this._mode === Mode.PROP) {
      return false;
    }

    return !(
      this._value.nodeType === Node.ELEMENT_NODE ||
      this._value.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
      this._value.nodeType === Node.DOCUMENT_NODE
    );
  }

  /**
   * Возвращает строку контента ноды. Если это Элемент — первый, открывающий, тег.
   * @return {string}
   */
  _getMainHeadContent() {
    let val;
    if (this._mode === Mode.PREVIEW) {
      val = this._getHeadPlainContent(this._value);
    } else {
      val = this._getHeadNodesContent(this._value);
    }
    return val;
  }

  _getHeadNodesContent(v) {
    let val;
    if (v.nodeType === Node.ELEMENT_NODE) {
      const attrs = getElementAttributesStr(v);
      val = `<span class="c-html__tag">&lt;<span class="c-html__tag-name">${v.tagName.toLowerCase()}</span>${attrs ? ` ${attrs}` : ``}&gt;</span>`;
    } else if (v.nodeType === Node.TEXT_NODE) {
      val = v.data;
    } else if (v.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      val = `#document-fragment`;
    } else if (v.nodeType === Node.DOCUMENT_NODE) {
      val = `#document`;
    } else if (v.nodeType === Node.COMMENT_NODE) {
      val = `<span class="c-html__comment">&lt;!-- ${v.data} --&gt;</span>`;
    } else if (v.nodeType === Node.ATTRIBUTE_NODE) {
      val = `<span class="c-html__attr-name">${v.name}</span>`;
    } else if (v.nodeType === Node.DOCUMENT_TYPE_NODE) {
      val = `<span class="c-html__doctype">&lt;!DOCTYPE html&gt;</span>`;
    } else {
      val = `not implemented`;
    }
    return val;
  }

  _getHeadPlainContent(v) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName#Value
    let val;
    if (v.nodeType === Node.ELEMENT_NODE) {
      val = `<span class="c-html__tag-name">${v.tagName.toLowerCase()}</span>`;
      if (v.id) {
        val += `<span class="c-html__id">#${v.id}</span>`;
      }
      if (v.classList.length) {
        val += `<span class="c-html__attr-name">.${Array.prototype.join.call(v.classList, `.`)}</span>`;
      }
    } else {
      val = `<span class="c-html__tag-name">${v.nodeName}</span>`;
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

      let closingTag = this._getClosingTag();
      return `${content}${closingTag}`;
    } else if (this._value.nodeType === Node.ATTRIBUTE_NODE) {
      const attrValue = this._value.value;
      return attrValue ? `<span class="c-html__tag">=&quot;<span class="c-html__attr-value">${attrValue}</span>&quot;</span>` : ``;
    }
    return ``;
  }

  _getClosingTag() {
    const tagNameLower = this._value.tagName.toLowerCase();
    if (!ELS_WITHOUT_ENDING_TAG.includes(tagNameLower)) {
      return `<span class="c-html__tag-name">&lt;/${tagNameLower}&gt;</span>`;
    }
    return ``;
  }

  _getContentType() {
    return (
      this._mode === Mode.PREVIEW
    ) ? ContentType.PLAIN : ContentType.NODES;
  }

  createContent(node) {
    const fragment = document.createDocumentFragment();

    const mode = Mode.PROP;

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (this._console.checkInstanceOf(node, `HTMLTemplateElement`)) {
        const val = node.content;
        const nodeView = new NodeView({val, mode, depth: this.nextNestingLevel, parentView: this}, this._console);
        const entryEl = new EntryView({entryEl: nodeView.el, withoutKey: true}).el;
        fragment.appendChild(entryEl);
      }
      for (let childNode of [...node.childNodes]) {
        if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent.trim()) {
          continue;
        }
        const nodeView = new NodeView({val: childNode, mode, depth: this.nextNestingLevel, parentView: this}, this._console);
        const entryEl = new EntryView({entryEl: nodeView.el, withoutKey: true}).el;
        fragment.appendChild(entryEl);
      }
    }

    const closingTag = this._getClosingTag();
    if (closingTag) {
      const entryEl = getElement(closingTag);
      const el = new EntryView({entryEl, withoutKey: true}).el;
      fragment.appendChild(el);
    }

    // const keyEl = this._console.createTypedView(this._pairKey, this._mode, this.nextNestingLevel, this, this._propKey).el;


    return {fragment};
  }
}
