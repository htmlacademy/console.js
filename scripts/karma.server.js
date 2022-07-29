//

const { Server: KarmaServer } = require("karma");
const { join } = require("path");

const karmaServer = new KarmaServer({
  configFile: join(__dirname, "../karma.conf.js"),
  singleRun: true,
  debug: true,
  files: [
    "node_modules/chai/chai.js",
    "karma-chai-adapter.js",
    "build/js/index.js",
    "build/js/tests/**/*.test.js"
  ]
});

karmaServer.start();
