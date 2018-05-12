const params = {
  common: {
    expandDepth: 2,
    maxFieldsToExpand: 10
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
