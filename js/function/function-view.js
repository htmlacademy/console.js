import TypeView from '../type-view';
import {Mode, ViewType} from '../enums';

const MAX_PREVIEW_FN_BODY_LENGTH = 43;

const FnType = {
  PLAIN: `plain`,
  ARROW: `arrow`,
  CLASS: `class`
};

// arguments, caller, length, name, prototype, __proto__, [[FunctionLocation]], [[Scopes]]

// if .caller not accessed — не выводим
// if prototype undefined — не выводим
// name — если неименованная — получает имя переменной, в которую записана
// если именнованная — то имя ф-ии

export default class FunctionView extends TypeView {
  constructor(params, cons) {
    super(params, cons);
    this.viewType = ViewType.FUNCTION;
    if (!params.parentView) {
      this._rootView = this;
    }
    this._fnType = FunctionView.checkFnType(this.value);
  }

  get template() {
    const isShowInfo = this._fnType !== FnType.ARROW || this._mode === Mode.PREVIEW;
    const body = this._getBody();
    return `\
<div class="console__item item item--${this.viewType} ${this._mode === Mode.ERROR ? `error` : ``}">\
  <div class="head item__head italic">\
    <pre class="head__content"><span class="info info--function ${isShowInfo ? `` : `hidden`}">${this._getInfo()}</span>${isShowInfo && body ? ` ` : ``}${this._getBody()}</pre>\
  </div>\
  <div class="item__content entry-container entry-container--${this.viewType} hidden"></div>\
</div>`;
  }

  afterRender() {
    const params = {
      isOpeningDisabled: this._mode !== Mode.DIR && this._mode !== Mode.PROP
    };

    this.state = params;
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
      case Mode.ERROR:
        str = this._getHeadLogMarkup();
        break;
    }
    return str;
  }

  _getHeadPropMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();
    const joinedLines = bodyLines.join(`\n`);

    let markup = `\
${this.value.name ? this.value.name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType === FnType.ARROW) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{...}`}`;
    }
    return markup;
  }

  _getHeadDirMarkup() {
    const params = this._parseParams();

    let markup = `\
${this.value.name ? this.value.name : ``}\
${this._fnType === FnType.PLAIN ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? `()` : ``}`;
    return markup;
  }

  _getHeadLogMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();

    return `\
${this.value.name && this._fnType !== FnType.ARROW ? `${this.value.name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${bodyLines.join(`\n`)}`;
  }

  _parseParams() {
    const str = this.value.toString();
    const paramsStart = str.indexOf(`(`);
    const paramsEnd = str.indexOf(`)`);

    const paramsContent = str.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  _parseBody() {
    let str = this.value.toString().trim();

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
    const fnKeys = [`name`, `prototype`, `length`, `__proto__`];
    const keys = Object.keys(fn).concat(fnKeys);
    for (let key of keys) {
      let value;
      try {
        const tempValue = fn[key];
        if (typeof tempValue !== `undefined`) {
          value = tempValue;
        } else {
          continue;
        }
      } catch (err) {
        continue;
      }
      const view = this._console.createTypedView(value, Mode.PROP, this.nextNestingLevel, this, key);
      const entryEl = FunctionView.createEntryEl(key.toString(), view.el);
      fragment.appendChild(entryEl);
    }
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
