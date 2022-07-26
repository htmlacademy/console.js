// webpack.config.js
// link: https://webpack.js.org/configuration/

// TODO: добавить возможность строить .min файл и не .min
// TODO: нужно строить ещё и test-скрипты
// TODO: а потом можно будет вычистить gulp совсем

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

const cssEntries = {
  "css/style.min": "./sass/style.scss",
  "css/prism.min": join(
    __dirname,
    "node_modules/prismjs/themes/prism.css"
  )
};

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
    entry: cssEntries,
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
      }, {
        test: /\.css/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ]
      }],
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
