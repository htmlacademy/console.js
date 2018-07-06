/* eslint no-eval: "off" */
import acorn from 'acorn/dist/acorn';
// import walk from 'acorn/dist/walk';
// import estraverse from 'estraverse/estraverse';
// import babelParser from '@babel/traverse';
import PromptView from './prompt-view';

const globalNotStrictEval = eval; // Bypass strict mode with Indirect eval call!
export default class Prompt {
  constructor(container, consoleGlobalName, params = {}) {
    if (!container) {
      throw new Error(`Prompt is not inited!`);
    } else if (!(container instanceof HTMLElement)) {
      throw new TypeError(`HTML element must be passed as container`);
    }
    this._container = container;
    this._consGlobalName = consoleGlobalName;
    this._view = new PromptView();
    this._view.onSend = this._handleSend.bind(this);
    this._container.appendChild(this._view.el);

    this._params = params;
  }

  _handleSend(code) {
    const ast = acorn.parse(code);
    const body = ast.body;
    let l = body.length;
    let lastExpressionStatementNode;
    while (l--) {
      const node = body[l];
      if (node.type === `ExpressionStatement`) {
        lastExpressionStatementNode = node;
        break;
      }
    }
    let editedCode;
    if (lastExpressionStatementNode) {
      const leftStrPart = code.substring(0, lastExpressionStatementNode.start);
      const rightStrPart = code.substring(lastExpressionStatementNode.end, code.length);
      const exprStrPart = code.substring(lastExpressionStatementNode.start, lastExpressionStatementNode.end);

      editedCode = `${leftStrPart};${this._consGlobalName}.log(${exprStrPart});${rightStrPart}`;
    } else {
      editedCode = `${code};${this._consGlobalName}.log(void 0);`;
    }
    this._view.createScriptFromCodeAndAppend(editedCode);
  }
}
