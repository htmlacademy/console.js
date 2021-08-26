export default class MapEntryView extends TypeView {
    viewType: string;
    _pairKey: any;
    _pairValue: any;
    _pairKeyEl: Element;
    _pairValueEl: Element;
    createContent(): {
        fragment: DocumentFragment;
    };
}
import TypeView from "../type-view";
