const params = {
  function: {
    nowrapOnLog: true
  },
  common: {
    excludeProperties: [`__proto__`],
    maxFieldsInHead: 5,
    minFieldsToExpand: 5,
    maxFieldsToExpand: 15,
    expandDepth: 1
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
