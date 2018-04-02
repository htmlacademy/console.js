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

    switch (this._mode) {
      case Mode.PREVIEW:
      // case Mode.LOG:
      // case Mode.ERROR:
        // this._templateParams.onlyWrapper = true;
        break;
    }
  }

  afterRender() {
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
        this._headContentEl.innerHTML = this._getLogMarkup();
        break;
      case Mode.PREVIEW:
        isShowInfo = true;
        // this._headInfoEl.innerHTML = `f`;
        // this.toggleInfoShowed();
        break;
    }
    if (isShowInfo) {
      this.toggleInfoShowed();
    }

    if (this._mode !== Mode.PREVIEW) {
      this.toggleHeadContentShowed();
    }

    if (this._mode !== Mode.DIR && this._mode !== Mode.PROP) {
      return;
    }

    if (this._isAutoExpandNeeded) {
      this._toggleContent();
    }
    this._setHeadClickHandler();
  }

  _getHeadPropMarkup() {
    const {name, params, lines} = this.parseFunction(this.value);
    const joinedLines = lines.join(`\n`);

    let markup = `\
<span>\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType !== FnType.CLASS) {
      markup += `${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `{...}`}`;
    }
    markup += `</span>`;
    return markup;
  }

  _getHeadDirMarkup() {
    const {name, params} = this.parseFunction(this.value);

    let markup = `\
  <span>\
  ${name ? name : ``}\
  ${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}</span>`;
    return markup;
  }

  _getLogMarkup() {
    // return `<pre>${this.value.toString()}</pre>`;
    const {name, params, lines} = this.parseFunction(this.value);
    return `\
<pre>\
${name && this._fnType !== FnType.ARROW ? `${name} ` : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}${lines.join(`\n`)}\
</pre>`;
  }

  parseParams(funString) {
    const paramsStart = funString.indexOf(`(`);
    const paramsEnd = funString.indexOf(`)`);

    const paramsContent = funString.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  parseName(funString) {
    let endingChar;
    if (this._fnType === FnType.CLASS) {
      endingChar = `{`;
    } else if (this._fnType === FnType.PLAIN) {
      endingChar = `(`;
    }
    let name;
    const re = new RegExp(`(?:class|function)\\s+(\\w+)\\s*(?:\\${endingChar})`);
    const ex = re.exec(funString);
    if (ex !== null) {
      name = ex[1];
    }
    return name;
  }

  parseBody(funString) {
    const bodyStart = funString.indexOf(`{`);
    const bodyEnd = funString.lastIndexOf(`}`);

    const bodyContent = funString.substring(bodyStart, bodyEnd + 1).trim();

    if (!bodyContent) {
      return [];
    }

    return bodyContent.split(`\n`);
  }

  parseFunction(fnOrString) {
    let str;
    if (typeof fnOrString !== `string`) {
      str = fnOrString.toString();
    }
    return {
      name: fnOrString.name, // this.parseName(str),
      params: this.parseParams(str),
      lines: this.parseBody(str)
    };
  }

  createContent(fn) {
    const fragment = document.createDocumentFragment();
    const fnKeys = [`name`, `prototype`, `caller`, `arguments`, `length`, `__proto__`];
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
    let str = fn.toString();
    const firstParenthesisIndex = str.indexOf(`(`);

    const classIndex = str.indexOf(`class`);
    const arrowIndex = str.indexOf(`=>`);
    if (classIndex !== -1 && classIndex < firstParenthesisIndex) {
      return FnType.CLASS;
    } else if (arrowIndex !== -1 && arrowIndex > firstParenthesisIndex) {
      return FnType.ARROW;
    }
    return FnType.PLAIN;
  }
}
