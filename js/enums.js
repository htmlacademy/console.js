/**
 * Console modes
 * @enum {string}
 */
export const Mode = {
  LOG: `log`,
  DIR: `dir`,
  PREVIEW: `preview`,
  PROP: `prop`,
  ERROR: `error`
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
 * CSS classes
 * @enum {string}
 */
export const Class = {
  CONSOLE_ITEM_HEAD: `item__head`,
  CONSOLE_ITEM_POINTER: `item_pointer`,
  CONSOLE_ITEM_HEAD_SHOW: `item__head_show`,
  ENTRY_CONTAINER_BRACED: `entry-container_braced`,
  ENTRY_CONTAINER_OVERSIZE: `entry-container_oversize`,
  CONSOLE_ITEM_HEAD_PARENTHESED: `item__head_parenthesed`,
  CONSOLE_ITEM_HEAD_INFO: `item__head-info`,
  CONSOLE_ITEM_HEAD_ELEMENTS: `item__head-elements`,
  CONSOLE_ITEM_HEAD_ELEMENTS_SHOW: `item__head-elements_show`,
  CONSOLE_ITEM_CONTENT_CONTAINTER: `item-content-container`,
  CONSOLE_ITEM_CONTENT_CONTAINTER_SHOW: `item-content-container_show`,
  CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH: `item__head-elements-length`,
  CONSOLE_ITEM_HEAD_ELEMENTS_LENGTH_SHOW: `item__head-elements-length_show`
};

/**
 * Console environment
 * @enum {string}
 */
export const Env = {
  TEST: `test`
};
