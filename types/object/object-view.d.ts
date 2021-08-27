export default class ObjectView extends TypeView {
    viewType: string;
    _viewTypeParams: any;
    get isShowInfo(): boolean;
    get isShowBraces(): boolean;
    get isShowHeadContent(): boolean;
    get isDisableOpening(): boolean;
    get isEnableItalic(): boolean;
    get isEnableError(): boolean;
    set isEnableOversized(arg: any);
    get isEnableOversized(): any;
    _isEnableOversized: any;
    toggleError(isEnable: any): boolean;
    get headContentClassName(): string;
    getHeadContent(): any;
    createContent(obj: any, inHead: any): {
        fragment: DocumentFragment;
        isOversized: boolean;
    };
}
import TypeView from "../type-view";
