/**
 * Console modes
 */
export type Mode = string;
export namespace Mode {
    const LOG: string;
    const DIR: string;
    const PREVIEW: string;
    const PROP: string;
    const ERROR: string;
    const LOG_HTML: string;
}
/**
 * Viewtypes
 */
export type ViewType = string;
export namespace ViewType {
    const FUNCTION: string;
    const OBJECT: string;
    const ARRAY: string;
    const PRIMITIVE: string;
}
/**
 * Console environment
 */
export type Env = string;
export namespace Env {
    const TEST: string;
}
/**
 * Promise state
 */
export type PromiseStatus = string;
export namespace PromiseStatus {
    const resolved: string;
    const rejected: string;
    const pending: string;
}
export type WhereChangeHeaderOnExpand = string;
export namespace WhereChangeHeaderOnExpand {
    const ANY_DEPTH: string;
    const ANY_DEPTH_EXCEPT_ROOT: string;
}
