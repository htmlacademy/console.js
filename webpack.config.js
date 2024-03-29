// webpack.config.js
// link: https://webpack.js.org/configuration/

const { join } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { sync: glob } = require("glob");

const env = () => (
  process.env.NODE_ENV === "production" ?
  "production" : "development"
);

const testing = () => (
  process.env.NODE_ENV === "test"
);

const overrideBrowserslist = [
  "last 1 version",
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Opera versions",
  "last 2 Edge versions"
];

const getPostcssOptions = (minify) => {
  const plugins = [
    require("autoprefixer")({
      overrideBrowserslist
    }),
    require("css-mqpacker")({
      sort: true
    })
  ];

  if (minify) {
    plugins.push(require("postcss-csso"));
  }

  return {
    postcssOptions: {
      plugins
    }
  };
}

const jsIndexEntries = () => [
  "index",           // window.Console
  "index-prompt",    // window.Prompt
  "index-silent"     // hell if i know
].reduce(
    (entries, name) => ({...entries, ["js/" + name]: "./src/" + name + ".js"}),
    {}
  );

const jsPresetEntries = () => {
  const files = glob("./src/presets/*.js");
  return files.reduce((entries, file) => {
    const id = ("js/" + file.slice(
      "./src/".length,
      file.length - ".js".length
    ));
    return {...entries, [id]: file};
  }, {});
};

const jsEntries = () => ({
  ...jsPresetEntries(),
  ...jsIndexEntries(),
});

const jsTestEntries = () => {
  const files = glob("./src/tests/**/*.js");
  return files.reduce((entries, file) => {
    const id = ("js/" + file.slice(
      "./src/".length,
      file.length - ".js".length
    ));
    return {...entries, [id]: file};
  }, {});
};

const fixWithMinify = (minify) => (
  minify ? (id) => id + ".min" : (id) => id
);

const cssEntries = (minify) => {
  const fixId = fixWithMinify(minify);
  return {
    [fixId("css/style")]: "./sass/style.scss",
    [fixId("css/prism")]: join(
      __dirname,
      "node_modules/prismjs/themes/prism.css"
    )
  }
};

const targetPath = join(__dirname, "build");

module.exports = () => {
  const jsConfig = {
    mode: env(),
    target: "web",
    entry: jsEntries(),
    output: {
      iife: true,
      path: targetPath,
      library: { type: "window" }
    }
  };

  const jsTestConfig = {
    mode: "development",
    target: "node",
    entry: jsTestEntries(),
    output: {
      path: targetPath
    }
  };

  const cssConfig = (minify) => {
    const getStyleRule = (re, {minify, sass = false} = {}) => {
      const options = getPostcssOptions(minify);
      const loaders = [
        MiniCssExtractPlugin.loader,
        "css-loader",
        { loader: "postcss-loader", options },
      ];

      if (sass) {
        loaders.push("sass-loader");
      }

      return {
        test: re,
        use: loaders,
      };
    };

    return {
      mode: "development",
      entry: cssEntries(minify),
      output: {
        path: targetPath,
      },
      plugins: [
        new MiniCssExtractPlugin(),
      ],
      module: {
        rules: [
          getStyleRule(/\.scss/i, { minify, sass: true }),
          getStyleRule(/\.css/i, { minify })
        ],
      }
    };
  };

  return testing() ? [
    jsConfig,
    jsTestConfig,
  ] : [
    jsConfig,
    cssConfig(false),
    cssConfig(true),
  ];
}
