const params = {
  function: {
    nowrapOnLog: true
  },
  common: {
    excludeProperties: [`__proto__`],
    maxFieldsInHead: 5,
    minFieldsToExpand: 5,
    maxFieldsToExpand: 15
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
