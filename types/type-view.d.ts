export default class TypeView extends AbstractView {
    /**
     * @param {HTMLElement|null} entryEl
     * @param {DocumentFragment} fragment
     */
    static appendEntryElIntoFragment(entryEl: HTMLElement | null, fragment: DocumentFragment): void;
    static prependEntryElIntoFragment(entryEl: any, fragment: any): void;
    static compareProperties(a: any, b: any): number;
    constructor(params: any, cons: any);
    _parentView: any;
    rootView: any;
    _console: any;
    _value: any;
    _mode: any;
    _type: any;
    _propKey: any;
    _currentDepth: any;
    _cache: {};
    /**
     * @abstract
     * @protected
     */
    protected _afterRender(): void;
    _headEl: Element;
    _headContentEl: Element;
    _infoEl: Element;
    _contentEl: Element;
    get protoConstructorName(): any;
    set stringTagName(arg: any);
    get stringTagName(): any;
    get value(): any;
    get propKey(): any;
    get parentView(): any;
    /**
     * Current state
     * @type {{}}
     * @param {{}} params — object with values which will be assigned throught setters
     */
    get _state(): {};
    _viewState: {};
    /**
     * @abstract
     * @return {{}} if not overriden return object without descriptors
     */
    _getStateDescriptors(): {};
    /**
     * @return {{}} — object that contains descriptors only
     */
    _getStateCommonDescriptors(): {};
    toggleHeadContentBraced(isEnable: any): boolean;
    toggleHeadContentOversized(isEnable: any): boolean;
    toggleInfoShowed(isEnable: any): boolean;
    toggleHeadContentShowed(isEnable: any): boolean;
    toggleContentShowed(isEnable: any): boolean;
    toggleItalic(isEnable: any): boolean;
    toggleArrowPointer(isEnable: any): boolean;
    toggleArrowBottom(isEnable: any): boolean;
    get isOpeningAllowed(): boolean;
    get depth(): any;
    get nextNestingLevel(): any;
    get _ownPropertySymbols(): any;
    get _ownPropertyDescriptors(): any;
    get _ownPropertyDescriptorsWithGetSet(): any;
    get _ownPropertyGetSetLength(): any;
    get _allPropertyDescriptors(): any;
    get _allPropertyDescriptorsWithGetters(): any;
    get _categorizedSortedProperties(): any;
    get _firstProtoContainingObject(): any;
    /**
     * @param {boolean} inHead — is head entries
     * @return {Set}
     */
    _getEntriesKeys(inHead: boolean): Set<any>;
    /**
     * Head content entries keys
     * @type {Set}
     */
    get headContentEntriesKeys(): Set<any>;
    _headEntriesKeys: Set<any>;
    /**
     * Content entries keys
     * @type {Set}
     */
    get contentEntriesKeys(): Set<any>;
    _entriesKeys: Set<any>;
    set isAutoExpandNeeded(arg: boolean);
    /**
     * Check if autoexpand needed
     * Setter for force
     * @type {boolean}
     */
    get isAutoExpandNeeded(): boolean;
    get isChangeHeaderOnExpandNeeded(): void;
    get info(): any;
    _headClickHandler(evt: any): void;
    _addOrRemoveHeadClickHandler(bool: any): void;
    _bindedHeadClickHandler: any;
    _createGettersEntriesFragment(): DocumentFragment;
    /**
     * Create entry element
     * @protected
     * @param {{}} params
     * @param {string} params.key — key, index of array or field name
     * @param {HTMLSpanElement|undefined} params.el — HTML span element to append into container
     * @param {Mode} params.mode — log mode
     * @param {boolean} [params.withoutKey] — create entry without key element
     * @param {function} [params.getViewEl] — function to get element if so wasn't present while calling this method
     * @return {HTMLSpanElement}
     */
    protected _createEntryEl({ key, el, mode, withoutKey, withoutValue, getViewEl, isGrey }: {}): HTMLSpanElement;
    /**
     * Create typed entry element
     * @protected
     * @param {{}} params
     * @param {{}} params.obj — object/array/fn
     * @param {string} params.key — key, index of array or field name
     * @param {Mode} params.mode — log mode
     * @param {boolean} [params.withoutKey] — create entry without key element
     * @return {HTMLSpanElement}
     */
    protected _createTypedEntryEl({ obj, key, mode, withoutKey, notCheckDescriptors, canReturnNull }: {}): HTMLSpanElement;
}
import AbstractView from "./abstract-view";
