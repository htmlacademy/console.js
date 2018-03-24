import Console from './main';

window.jsConsole = new Console(document.querySelector(`.console`), {
  object: {
    expandDepth: 2,
    minFieldsToExpand: 1,
    maxFieldsInHead: 2,
    exclude: [`function`, `array`]
  },
  function: {
    expandDepth: 1
  },
  array: {
    expandDepth: 2,
    minFieldsToExpand: 4
  }
});
