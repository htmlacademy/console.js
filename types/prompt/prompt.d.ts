export default class Prompt {
    constructor(container: any, consoleGlobalName: any, params?: {});
    _container: HTMLElement;
    _consGlobalName: any;
    _isMobile: boolean;
    _view: PromptView;
    _params: {};
    get viewHeight(): number;
    _handleSend(code: any, highlightedMarkup: any): void;
}
import PromptView from "./prompt-view";
