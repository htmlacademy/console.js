module.exports = function (config) {
  config.set({
    basePath: ``,
    // preprocessors: {
    //   'js/**/*.js': [`babel`]
    // },
    frameworks: [`mocha`, `chai`],
    files: [
      `build/js/**/*.js`,
      `node_modules/babel-polyfill/browser.js`,
      // `node_modules/babel-polyfill/dist/polyfill.js`,
    ],
    browsers: [`Chrome`],
    // singleRun: true
  });
};
