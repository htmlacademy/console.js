import Console from './main';
import {ViewType} from "./enums";

window.jsConsole = new Console(document.querySelector(`.console`), {
  object: {
    maxFieldsInHead: 2,
    expandDepth: 2,
    exclude: [ViewType.ARRAY]
  },
  // function: {
    // expandDepth: 2,
    // exclude: [ViewType.OBJECT, ViewType.ARRAY]
  // },
  // array: {
  //   expandDepth: 2,
  //   exclude: [ViewType.OBJECT, ViewType.FUNCTION]
  // }
});
