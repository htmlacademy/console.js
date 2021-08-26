export default class ArrayView extends TypeView {
    viewType: string;
    _viewTypeParams: any;
    _lengthEl: Element;
    toggleContentLengthShowed(isEnable: any): boolean;
    get isShowInfo(): any;
    get isShowHeadContent(): boolean;
    get isShowLength(): any;
    createContent(arr: any, inHead: any): {
        fragment: DocumentFragment;
        isOversized: boolean;
    };
}
import TypeView from "../type-view";
