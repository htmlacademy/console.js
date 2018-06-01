/* eslint no-empty: "off"*/
import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

const MAX_PREVIEW_FN_BODY_LENGTH = 43;

const FnType = {
  PLAIN: `plain`,
  ARROW: `arrow`,
  CLASS: `class`
};

export default class FunctionView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.FUNCTION;
    if (!params.parentView) {
      this.rootView = this;
    }
    this._fnType = FunctionView.checkFnType(this._value);
  }

  get template() {
    const isShowInfo = this._fnType !== FnType.ARROW || this._mode === Mode.PREVIEW;
    const body = this._getBody();
    const nowrapOnLog = this._console.params[this.viewType].nowrapOnLog;

    return `\
<div class="console__item item item--${this.viewType} ${this._mode === Mode.ERROR ? `error` : ``}">\
  <div class="head item__head italic">\
    <pre class="head__content ${nowrapOnLog ? `nowrap` : `` }"><span class="info info--function ${isShowInfo ? `` : `hidden`}">${this._getInfo()}</span>${isShowInfo && body ? ` ` : ``}${this._getBody()}</pre>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  _afterRender() {
    this._state.isOpeningDisabled = this.isDisableOpening;

    if (this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) {
      this._headContentEl.addEventListener(`click`, () => {
        this._headContentEl.classList.toggle(`nowrap`);
      });
    }
  }

  get isDisableOpening() {
    return this._mode !== Mode.DIR && this._mode !== Mode.PROP;
  }

  _getInfo() {
    let str = ``;
    switch (this._fnType) {
      case FnType.CLASS:
        str = `class`;
        break;
      case FnType.PLAIN:
      case FnType.ARROW:
        str = `f`;
        break;
    }
    return str;
  }

  _getBody() {
    let str = ``;
    switch (this._mode) {
      case Mode.PROP:
        str = this._getHeadPropMarkup();
        break;
      case Mode.DIR:
        str = this._getHeadDirMarkup();
        break;
      case Mode.LOG:
      case Mode.LOG_HTML:
      case Mode.ERROR:
        str = this._getHeadLogMarkup();
        break;
    }
    return str;
  }

  _getHeadPropMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();
    const joinedLines = bodyLines.map((str) => str.trim()).join(` `);

    let markup = `\
${this._value.name ? this._value.name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType === FnType.ARROW) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{…}`}`;
    }
    return markup;
  }

  _getHeadDirMarkup() {
    const params = this._parseParams();

    let markup = `\
${this._value.name ? this._value.name : ``}\
${this._fnType === FnType.PLAIN ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? `()` : ``}`;
    return markup;
  }

  _getHeadLogMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();

    return `\
${this._value.name && this._fnType !== FnType.ARROW ? `${this._value.name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${bodyLines.join(`\n`)}`;
  }

  _parseParams() {
    const str = this._value.toString();
    const paramsStart = str.indexOf(`(`);
    const paramsEnd = str.indexOf(`)`);

    const paramsContent = str.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  _parseBody() {
    let str = this._value.toString().trim();

    let bodyContent = [];
    if (this._fnType === FnType.ARROW) {
      const arrowIndex = str.indexOf(`=>`);
      str = str.substring(arrowIndex + 2);
    }
    const firstBraceIndex = str.indexOf(`{`);
    str = str.substring(firstBraceIndex);
    const lines = str.split(`\n`);
    const firstLine = lines.shift();
    const firstWhitespaceIndexes = lines
        .filter((line) => line.length !== 0)
        .map((line) => {
          const ex = /^\s+/.exec(line);
          if (ex && ex[0].hasOwnProperty(`length`)) {
            return ex[0].length;
          }
          return 0;
        });

    const min = Math.min(...firstWhitespaceIndexes);
    bodyContent = lines.map((line) => line.slice(min));
    bodyContent.unshift(firstLine);
    return bodyContent;
  }


  createContent(fn) {
    const fragment = document.createDocumentFragment();
    const entriesKeys = this.contentEntriesKeys;
    for (let key of entriesKeys) {
      TypeView.appendEntryElIntoFragment(
          this._createTypedEntryEl({obj: fn, key, mode: Mode.PROP}),
          fragment
      );
    }
    TypeView.appendEntryElIntoFragment(
        this._createTypedEntryEl({obj: fn, key: `__proto__`, mode: Mode.PROP, notCheckDescriptors: true}),
        fragment
    );
    return {fragment};
  }

  static checkFnType(fn) {
    const str = fn.toString();
    const firstParenthesisIndex = str.indexOf(`(`);

    const classIndex = str.indexOf(`class`);
    const arrowIndex = str.indexOf(`=>`);
    if (classIndex !== -1 && (firstParenthesisIndex === -1 || classIndex < firstParenthesisIndex)) {
      return FnType.CLASS;
    } else if (arrowIndex !== -1 && arrowIndex > firstParenthesisIndex) {
      return FnType.ARROW;
    }
    return FnType.PLAIN;
  }
}
