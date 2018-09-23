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
  PRIMITIVE: `primitive`
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
