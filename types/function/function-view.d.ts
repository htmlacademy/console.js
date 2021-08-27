export default class FunctionView extends TypeView {
    static checkFnType(fn: any): string;
    viewType: string;
    _viewTypeParams: any;
    _fnType: string;
    _bodyCanWrap: boolean;
    _nowrapOnLog: boolean;
    get isDisableOpening(): boolean;
    _getInfo(): string;
    _getBody(): string;
    /**
     * Head content string for Mode.PROP with body
     * body CAN NOT cointain newlines
     * Collapses body if it's lenght is out of MAX_PREVIEW_FN_BODY_LENGTH
     * @return {string}
     */
    _getHeadPropMarkup(): string;
    /**
     * Head content string for Mode.DIR
     * body CAN NOT cointain newlines
     * @return {string}
     */
    _getHeadDirMarkup(): string;
    /**
     * Head content string for Mode.PROP
     * body CAN cointain newlines
     * @return {string}
     */
    _getHeadLogMarkup(): string;
    _parseParams(): any;
    _parseBody(): any;
    createContent(fn: any): {
        fragment: DocumentFragment;
    };
}
import TypeView from "../type-view";
