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
    this._viewType = ViewType.FUNCTION;
    if (!params.parentView) {
      this._rootViewType = this._viewType;
    }
    this._fnType = FunctionView.checkFnType(this.value);
    this._templateParams = {
      pre: true
    };
  }

  afterRender() {
    this._headEl.classList.add(`item__head--italic`);
    this._headInfoEl.classList.add(`item__head-info--function`);
    switch (this._fnType) {
      case FnType.CLASS:
        this._headInfoEl.textContent = `class`;
        break;
      case FnType.PLAIN:
      case FnType.ARROW:
        this._headInfoEl.textContent = `f`;
        break;
    }
    let isShowInfo = false;
    if (this._fnType !== FnType.ARROW) {
      isShowInfo = true;
    }
    switch (this._mode) {
      case Mode.PROP:
        this._headContentEl.innerHTML = this._getHeadPropMarkup();
        break;
      case Mode.DIR:
        this._headContentEl.innerHTML = this._getHeadDirMarkup();
        break;
      case Mode.LOG:
      case Mode.ERROR:
        this._headContentEl.innerHTML = this._getHeadLogMarkup();
        break;
      case Mode.PREVIEW:
        isShowInfo = true;
        break;
    }
    const params = {
      isOpeningDisabled: false,
      isShowInfo,
      isHeadContentShowed: this._mode !== Mode.PREVIEW
    };
    if (this._mode !== Mode.DIR && this._mode !== Mode.PROP) {
      params.isOpeningDisabled = true;
    }
    this.state = params;
  }

  _getHeadPropMarkup() {
    const bodyLines = this._parseBody();
    const params = this._parseParams();
    const joinedLines = bodyLines.join(`\n`);

    let markup = `\
<span>\
${this.value.name ? this.value.name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType === FnType.ARROW) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{...}`}`;
    }
    markup += `</span>`;
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
<pre>\
${this.value.name && this._fnType !== FnType.ARROW ? `${this.value.name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${bodyLines.join(`\n`)}\
</pre>`;
  }

  _parseParams() {
    const str = this.value.toString();
    const paramsStart = str.indexOf(`(`);
    const paramsEnd = str.indexOf(`)`);

    const paramsContent = str.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  _parseBody() {
    const str = this.value.toString();

    let bodyContent = [];
    if (this._fnType === FnType.ARROW) {
      const arrowIndex = str.indexOf(`=>`);
      bodyContent = str.substring(arrowIndex + 2).trim().split(`\n`);
    } else {
      // const bodyStart = str.indexOf(`{`);
      // const bodyEnd = str.lastIndexOf(`}`);
      // bodyContent = str.substring(bodyStart, bodyEnd + 1).trim();
      const lines = str.split(`\n`);
      lines.shift();
      const firstWhitespaceIndexes = [];
      lines.forEach((line) => {
        const ex = /^\s+/.exec(line);
        if (ex && ex[0].hasOwnProperty(`length`)) {
          firstWhitespaceIndexes.push(ex[0].length);
        }
      });

      const min = Math.min(...firstWhitespaceIndexes);
      bodyContent = lines.map((line) => line.slice(min));
    }

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
      const view = this._console.createTypedView(value, Mode.PROP, this.nextNestingLevel, this);
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
