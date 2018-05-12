const params = {
  object: {
    maxFieldsInHead: 5
  },
  function: {
    nowrapOnLog: true
  },
  common: {
    excludeProperties: [`__proto__`]
  }
};

if (Array.isArray(window.jsConsolePresets)) {
  window.jsConsolePresets.push(params);
} else {
  window.jsConsolePresets = [params];
}
