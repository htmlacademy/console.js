/**
 * Console
 * @class
 */
export default class Console {
    /**
     * Initialize console into container
     * @param {HTMLElement} container — console container
     * @param {{}} config — parameters
     * @param {number} params.minFieldsToAutoexpand — min number of fields in obj to expand
     * @param {number} params.maxFieldsInHead — max number of preview fields inside head
     * @param {number} params.expandDepth — level of depth to expand
     * @param {Env} params.env — environment
     **/
    constructor(container: HTMLElement, config?: {});
    _el: HTMLDivElement;
    addConfig(config?: {}): void;
    _configs: any[];
    params: {
        object: {};
        array: {};
        function: {};
    };
    _parseConsoleParams(params: any): {
        env: any;
        global: any;
    };
    /**
     * @param {ViewType} viewType
     * @param {{}} params
     * @param {number} params.minFieldsToAutoexpand=0 — min number of fields in obj to expand
     * @param {number} params.maxFieldsToAutoexpand=Number.POSITIVE_INFINITY - max number of fields in obj to expand
     * @param {number} params.maxFieldsInHead=DEFAULT_MAX_FIELDS_IN_HEAD — max number of preview fields inside head
     * @param {number} params.expandDepth=0 — level of depth to expand
     * @param {[string]} params.removeProperties=[] — array of properties those won't show up
     * @param {[string]} params.excludePropertiesFromAutoexpand=[] — array of properties those won't autoexpand
     * @param {[ViewType]} params.excludeViewTypesFromAutoexpand=[] — array of view types those won't autoexpand
     * @param {boolean} params.showGetters=true — show getters in view or not
     * @param {boolean} params.showSymbols=true — show symbols in view or not
     * @param {boolean} params.countEntriesWithoutKeys=false — (applies only to ArrayView) count indexed entries or not
     * @param {boolean} params.nowrapOnLog=false — specifies if functions bodies will be collapsed
     * @return {{}} parsed params
     */
    _parseViewParams(viewType: ViewType, params?: {}): {};
    /**
     * This is implementation of https://console.spec.whatwg.org/#logger
     * @param {{}} opts
     * @param {[]} entries
     */
    _log(opts: {}, entries: []): void;
    _print({ mode, modifier, onPrint }: {
        mode: any;
        modifier: any;
        onPrint: any;
    }, values: any): void;
    _getRowEl(entries: any, mode: any, modifier: any): Element;
    /**
     * Subscribe on any event fired
     * @abstract
     */
    onAny(): void;
    /**
     * Subscribe on log event fired
     * @abstract
     **/
    onLog(): void;
    /**
     * Subscribe on logHTML event fired
     * @abstract
     **/
    onLogHTML(): void;
    /**
     * Subscribe on dir event fired
     * @abstract
     **/
    onDir(): void;
    /**
     * Subscribe on error event fired
     * @abstract
     **/
    onError(): void;
    /**
     * Equivalent to console.log
     * Push rest of arguments into container
     */
    log(...entries: any[]): void;
    /**
     * Equivalent to this.log but marks row as output
     */
    logOutput(...entries: any[]): void;
    /**
     * Equivalent to console.log but special charachters in strings won't be excaped
     * Push rest of arguments into container
     */
    logHTML(...entries: any[]): void;
    /**
     * Equivalent to console.error
     * Push single value into conainer
     */
    error(...entries: any[]): void;
    /**
     * Equivalent to console.dir
     * Push single value into container
     */
    dir(...entries: any[]): void;
    /**
     * Logs user input into container
     * Marks row as input
     * @param {string} markup
     */
    prompt(markup: string): void;
    /**
     * Clean container
     */
    clean(): void;
    checkInstanceOf(obj: any, constructorName: any): boolean;
    createTypedView(val: any, mode: any, depth: any, parentView: any, propKey: any): ObjectView | MapSetView | PromiseView | StringNumberView | ArrayView | FunctionView | PrimitiveView;
    /**
     * get innerHTML of container
     */
    get sourceLog(): string;
    /**
     * Extend console
     * @param {{}} consoleObject
     * @return {{}} extended console
     */
    extend(consoleObject: {}): {};
}
import { ViewType } from "./enums";
import ObjectView from "./object/object-view";
import MapSetView from "./object/map-set-view";
import PromiseView from "./object/promise-view";
import StringNumberView from "./object/string-number-view";
import ArrayView from "./array/array-view";
import FunctionView from "./function/function-view";
import PrimitiveView from "./primitive/primitive-view";
