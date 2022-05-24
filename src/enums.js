/**
 * Console modes
 * @enum {string}
 */
export const Mode = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  PROP: `prop`,
  ERROR: `error`,
  LOG_HTML: `log-html`
};

/**
 * Viewtypes
 * @enum {string}
 */
export const ViewType = {
  FUNCTION: `function`,
  OBJECT: `object`,
  ARRAY: `array`,
  PRIMITIVE: `primitive`,
  NODE: `node`
};

/**
 * Console environment
 * @enum {string}
 */
export const Env = {
  TEST: `test`
};

/**
 * Promise state
 * @enum {string}
 */
export const PromiseStatus = {
  resolved: `resolved`,
  rejected: `rejected`,
  pending: `pending`
};

/**
 * @enum {string}
 */
export const WhereChangeHeaderOnExpand = {
  ANY_DEPTH: `any-depth`,
  ANY_DEPTH_EXCEPT_ROOT: `any-depth-except-root`
};

export const GET_STATE_DESCRIPTORS_KEY_NAME = `get-state-descriptors`;
