const params = {
  function: {
    nowrapOnLog: true
  },
  common: {
    excludePropertiesFromAutoexpand: [`__proto__`],
    maxFieldsInHead: 5,
    minFieldsToAutoexpand: 5,
    maxFieldsToAutoexpand: 15
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
