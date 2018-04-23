module.exports = function (config) {
  config.set({
    basePath: ``,
    frameworks: [`mocha`, `chai`],
    files: [
      `build/js/tests/**/*.test.js`,
    ],
    client: {
      mocha: {
        timeout: 15000 // 6 seconds - upped from 2 seconds
      }
    },
    browsers: [`Chrome`],
    // customLaunchers: {
    //   ChromeHeadlessNoSandbox: {
    //     base: `ChromeHeadless`,
    //     flags: [`--no-sandbox`]
    //   }
    // }
  });
};
