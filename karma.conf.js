// karma.conf.js

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    basePath: ``,
    frameworks: [`mocha`],
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
