const params = {
  common: {
    expandDepth: 1,
    maxFieldsToExpand: 15
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
