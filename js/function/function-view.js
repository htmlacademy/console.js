import TypeView from '../type-view';
import {getElement, createTypedView} from '../utils';
import {Mode, Class} from '../enums';

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
  constructor(fn, mode) {
    super(fn, `function`, false);
    this._mode = mode;
    this._isOpened = false;
    this._fnType = FunctionView.checkFnType(fn);
  }

  get template() {
    let tpl = `<div class="function console__item">`;
    switch (this._mode) {
      case Mode.PREVIEW:
        tpl += `f`;
        break;
      case Mode.DIR:
        tpl += `\
<div class="${Class.CONSOLE_ITEM_HEAD}">${this._getHeadMarkup()}</div>\
<div class="${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}"></div>`;
        break;
      case Mode.LOG:
        tpl += this._getLogMarkup();
        break;
    }
    tpl += `</div>`;
    return tpl;
  }

  bind() {
    if (this._mode === Mode.DIR) {
      this._contentContainerEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_CONTENT_CONTAINTER}`);
      const previewEl = this.el.querySelector(`.${Class.CONSOLE_ITEM_HEAD}`);
      // previewEl.appendChild(this.createPreview(this.value, true));

      previewEl.addEventListener(`click`, () => {
        if (this._isOpened) {
          this._hideContent();
        } else {
          this._showContent();
        }
        this._isOpened = !this._isOpened;
      });
    }
  }

  _showContent() {
    if (!this._proxiedContentEl) {
      this._proxiedContentEl = getElement(`<div class="console__item-content"></div>`);
      this._proxiedContentEl.appendChild(this.createContent(this.value));
    }

    this._contentContainerEl.appendChild(this._proxiedContentEl);
  }

  _hideContent() {
    this._contentContainerEl.innerHTML = ``;
  }

  _getHeadMarkup() {
    const {name, params, lines} = this._parseFunction(this.value);
    const joinedLines = lines.join(`\n`);

    let markup = `\
<span>\
${this._fnType === FnType.CLASS ? `class ` : ``}\
${this._fnType === FnType.PLAIN ? `f ` : ``}\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}`;
    if (this._fnType !== FnType.CLASS) {
      markup += `{\
  ${joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : `...`}\
}`;
    }
    markup += `</span>`;
    return markup;
  }

  _getLogMarkup() {
    return `<pre>${this.value.toString()}</pre>`;
    // const {name, params, lines} = this._parseFunction(this.value);
    /* return `\
<pre>\
${this._fnType === FnType.CLASS ? `class ` : ``}\
${this._fnType === FnType.PLAIN ? `function ` : ``}\
${name ? name : ``}\
${this._fnType !== FnType.CLASS ? `(${params.join(`, `)})` : ``}\
${this._fnType === FnType.ARROW ? ` => ` : ` `}{
${lines.join(`\n`)}
}
</pre>`;*/
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

  _parseParams(funString) {
    const paramsStart = funString.indexOf(`(`);
    const paramsEnd = funString.indexOf(`)`);

    const paramsContent = funString.substring(paramsStart + 1, paramsEnd).trim();

    return paramsContent ? paramsContent.split(`,`).map((it) => it.trim()) : [];
  }

  _parseName(funString) {
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

  _parseBody(funString) {
    const bodyStart = funString.indexOf(`{`);
    const bodyEnd = funString.lastIndexOf(`}`);

    const bodyContent = funString.substring(bodyStart + 1, bodyEnd).trim();

    if (!bodyContent) {
      return [];
    }

    return bodyContent.split(`\n`).map(function (it) {
      return it.trim();
    });
  }

  _parseFunction(fnOrString) {
    let str;
    if (typeof fnOrString !== `string`) {
      str = fnOrString.toString();
    }
    return {
      name: this._parseName(str),
      params: this._parseParams(str),
      lines: this._parseBody(str)
    };
  }

  createContent(fn) {
    const fragment = document.createDocumentFragment();
    const keys = [`name`, `prototype`, `caller`, `arguments`, `length`, `__proto__`];
    for (let key of keys) {
      let value;
      try {
        value = fn[key];
      } catch (err) {
        continue;
      }
      const view = createTypedView(value, Mode.DIR);
      const entryEl = FunctionView.createEntryEl(key, view.el);
      fragment.appendChild(entryEl);
    }
    return fragment;
  }

  static createEntryEl(key, valueEl) {
    const entryEl = getElement(`\
<span class="object__entry object-entry">
  <span class="object-entry__key">${key}</span><span class="object-entry__value-container"></span>
</span>`);
    const valueContEl = entryEl.querySelector(`.object-entry__value-container`);
    valueContEl.appendChild(valueEl);

    return entryEl;
  }
}
