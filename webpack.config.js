// webpack.config.js
// link: https://webpack.js.org/configuration/

const { join } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const env = () => (
  process.env.NODE_ENV === "production" ?
  "production" : "development"
);

const jsEntries = () => [
  "index",           // window.Console
  "index-prompt",    // window.Prompt
  "index-silent"     // hell if i know
].reduce(
    (entries, name) => ({...entries, ["js/" + name]: "./src/" + name + ".js"}),
    {}
  );

const jsPath = join(__dirname, "build");

module.exports = () => {
  const jsConfig = {
    mode: env(),
    target: "web",
    entry: jsEntries(),
    output: {
      iife: true,
      path: jsPath,
      library: { type: "window" }
    }
  };

  const cssConfig = {
    mode: env(),
    entry: {
      "css/style.min": "./sass/style.scss",
    },
    output: {
      path: jsPath,
    },
    plugins: [
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [{
        test: /\.scss/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]
      }]
    },
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ]
    }
  };

  return [
    jsConfig,
    cssConfig
  ];
}
