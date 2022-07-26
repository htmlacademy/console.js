// postcss.config.js

const overrideBrowserslist = [
  "last 1 version",
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Opera versions",
  "last 2 Edge versions"
];

module.exports = {
  plugins: [
    require("autoprefixer")({
      overrideBrowserslist
    }),
    require("css-mqpacker")({
      sort: true
    })
  ]
};
