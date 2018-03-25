module.exports = function (config) {
  config.set({
    basePath: ``,
    frameworks: [`mocha`, `chai`],
    files: [
      `build/js/tests/**/*.test.js`,
    ],
    browsers: [`ChromeHeadless`],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: `ChromeHeadless`,
        flags: [`--no-sandbox`]
      }
    }
  });
};
