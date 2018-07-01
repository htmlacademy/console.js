/* eslint no-eval: "off" */
import acorn from 'acorn/dist/acorn';
import walk from 'acorn/dist/walk';
// import babelParser from '@babel/parser';
import PromptView from './prompt-view';

const globalNotStrictEval = eval; // Bypass strict mode with Indirect eval call!
export default class Prompt {
  constructor(container, cons, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._console = cons;
    this._container = container;

    this._view = new PromptView();
    this._view.onSend = this._handleSend.bind(this);
    this._container.appendChild(this._view.el);

    this._params = params;
  }

  async _handleSend(code) {
    const {exprToEval, scriptCode} = this._preprocessCode(code);
    console.log(exprToEval, scriptCode);
    const ress = await this._view.createScriptFromCodeAndAppend(scriptCode);
    console.log(ress);
    const res = globalNotStrictEval(exprToEval);
    this._console.log(res);
  }

  _preprocessCode(code) {
    let lastExpressionStatement = void 0;
    walk.simple(acorn.parse(code), {
      VariableDeclaration(node) {
        // console.log(node)
      },
      ExpressionStatement(node) {
        lastExpressionStatement = node;
      }
    });
    let exprToEval = void 0;
    if (lastExpressionStatement) {
      exprToEval = code.substring(lastExpressionStatement.start, lastExpressionStatement.end);
    }
    return {exprToEval, scriptCode: code};
  }
}
