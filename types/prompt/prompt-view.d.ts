export default class PromptView extends AbstractView {
    constructor(isMobile: any);
    _isMobile: any;
    _text: string;
    _allowSend: boolean;
    _scriptsEl: Element;
    _inputEl: Element;
    _sendBtnEl: Element;
    editor: any;
    get height(): number;
    _handleMisbehaveInput(text: any): void;
    _handleKeyDown(evt: any): void;
    _handleSendClick(): void;
    _handleMouseDown(evt: any): void;
    _send(): void;
    onSend(): void;
    createScriptFromCodeAndAppend(code: any, cb?: () => void): void;
}
import AbstractView from "../abstract-view";
