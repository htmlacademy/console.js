module.exports = function (config) {
  config.set({
    basePath: ``,
    frameworks: [`mocha`, `chai`],
    // files: [
    //   `build/js/tests/**/*.test.js`,
    // ],
    browserConsoleLogOpptions: {
      level: `debug`,
      format: `%b %T: %m`,
      terminal: true
    },
    singleRun: true,
    client: {
      mocha: {
        timeout: 15000
      }
    },
    browsers: [`ChromeHeadless`],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: `ChromeHeadless`,
        flags: [`--no-sandbox`]
      }
    }
  });
};
