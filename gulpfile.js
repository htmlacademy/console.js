/* eslint-env node */
'use strict'; // eslint-disable-line
const del = require(`del`);
const gulp = require(`gulp`);
const gulpIf = require(`gulp-if`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const mqpacker = require(`css-mqpacker`);
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const babel = require(`rollup-plugin-babel`);
const nodeResolve = require(`rollup-plugin-node-resolve`);
const commonjs = require(`rollup-plugin-commonjs`);
const json = require(`rollup-plugin-json`);
const rollup = require(`gulp-better-rollup`);
const terser = require(`gulp-terser`);
const sourcemaps = require(`gulp-sourcemaps`);
const concat = require(`gulp-concat`);
const debug = require(`gulp-debug`);
const KarmaServer = require(`karma`).Server;

gulp.task(`style`, () => {
  return gulp.src([`sass/style.scss`])
      .pipe(plumber())
      .pipe(sass())
      .pipe(concat(`style.css`))
      .pipe(postcss([
        autoprefixer({
          browsers: [
            `last 1 version`,
            `last 2 Chrome versions`,
            `last 2 Firefox versions`,
            `last 2 Opera versions`,
            `last 2 Edge versions`
          ]
        }),
        mqpacker({sort: true})
      ]))
      .pipe(gulp.dest(`build/css`))
      .pipe(server.stream())
      .pipe(gulpIf(process.env.NODE_ENV === `production`, minify()))
      .pipe(rename(`style.min.css`))
      .pipe(gulp.dest(`build/css`));
});

gulp.task(`style-prism`, () => {
  return gulp.src([`node_modules/prismjs/themes/prism.css`])
      .pipe(plumber())
      .pipe(concat(`prism.css`))
      .pipe(postcss([
        autoprefixer({
          browsers: [
            `last 1 version`,
            `last 2 Chrome versions`,
            `last 2 Firefox versions`,
            `last 2 Opera versions`,
            `last 2 Edge versions`
          ]
        }),
        mqpacker({sort: true})
      ]))
      .pipe(gulp.dest(`build/css`))
      .pipe(server.stream())
      .pipe(gulpIf(process.env.NODE_ENV === `production`, minify()))
      .pipe(rename(`prism.min.css`))
      .pipe(gulp.dest(`build/css`));
});

gulp.task(`build-scripts`, () => {
  return gulp.src([`src/index.js`, `src/index-silent.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(rollup({
        plugins: [
          nodeResolve({
            jsnext: true,
            browser: true
          }),
          commonjs(),
          json(),
          babel({
            babelrc: false,
            exclude: [`node_modules/**`, `js/tests/**`],
            presets: [
              [`@babel/preset-env`, {modules: false, useBuiltIns: `entry`}]
            ]
          })
        ]
      }, `iife`))
      .pipe(gulpIf(process.env.NODE_ENV === `production`, terser({
        safari10: true,
        keep_fnames: true // eslint-disable-line
      })))
      .pipe(sourcemaps.write(``))
      .pipe(gulp.dest(`build/js`));
});

gulp.task(`build-prompt`, () => {
  return gulp.src([`src/index-prompt.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(rollup({
        plugins: [
          nodeResolve({
            jsnext: true,
            browser: true
          }),
          commonjs(),
          json(),
          babel({
            babelrc: false,
            exclude: [`node_modules/**`, `js/tests/**`],
            presets: [
              [`@babel/preset-env`, {modules: false}]
            ],
            plugins: [[`prismjs`, {
              "languages": [`javascript`]
            }]]
          })
        ]
      }, `iife`))
      .pipe(gulpIf(process.env.NODE_ENV === `production`, terser({
        keep_fnames: true // eslint-disable-line
      })))
      .pipe(sourcemaps.write(``))
      .pipe(gulp.dest(`build/js`));
});

gulp.task(`build-js-presets`, () => {
  return gulp.src([`src/presets/**/*.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(rollup({
        plugins: [
          nodeResolve(),
          commonjs(),
          // babel({
          //   babelrc: false,
          //   presets: [
          //     [`@babel/preset-env`, {modules: false}]
          //   ]
          // })
        ]
      }, `iife`))
      .pipe(gulpIf(process.env.NODE_ENV === `production`, terser({
        keep_fnames: true // eslint-disable-line
      })))
      .pipe(gulp.dest(`build/js/presets`));
});

gulp.task(`build-tests`, () => {
  return gulp.src([`src/tests/**/*.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(rollup({
        plugins: [
          nodeResolve(),
          commonjs()
        ]
      }, `iife`))
      .pipe(sourcemaps.write(``))
      .pipe(gulp.dest(`build/js/tests`));
});

gulp.task(`test`, function (done) {
  let testOnlyFiles;
  if (process.env.TEST_ONLY_FILES) {
    testOnlyFiles = process.env.TEST_ONLY_FILES
      .trim()
      .split(/\s*\,\s*|\s+/)
      .join(`|`);
  }

  new KarmaServer({
    configFile: __dirname + `/karma.conf.js`,
    singleRun: process.env.TEST_DEBUG !== `true`,
    debug: true,
    files: [
      `node_modules/chai/chai.js`,
      `karma-chai-adapter.js`,
      `build/js/index.js`,
      `build/js/tests/**/${testOnlyFiles ? `+(${testOnlyFiles})` : `*`}.test.js`
    ]
  }, done).start();
});

gulp.task(`test:noerror`, function (done) {
  new KarmaServer({
    configFile: __dirname + `/karma.conf.js`
  }, done).start();
});

gulp.task(`copy-html`, () => {
  return gulp.src(`*.{html,ico}`)
      .pipe(gulp.dest(`build`))
      .pipe(server.stream());
});

gulp.task(`copy`, gulp.series(
    `copy-html`,
    `build-scripts`,
    `build-prompt`,
    `build-js-presets`,
    process.env.NODE_ENV !== `production` ? `build-tests` : (done) => { done() }, // eslint-disable-line
    `style`,
    `style-prism`, () => {
      return gulp.src([
        `fonts/**/*.{woff,woff2}`,
        `img/**.*`
      ], {base: `.`})
        .pipe(gulp.dest(`build`));
    }));

gulp.task(`imagemin`, gulp.series(`copy`, () => {
  return gulp.src(`build/img/**/*.{jpg,png,gif}`)
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true})
      ]))
      .pipe(gulp.dest(`build/img`));
}));

gulp.task(`clean`, () => {
  return del([`build`, `tests`]);
});

gulp.task(`js-watch`, gulp.series(`build-scripts`, `build-prompt`, `build-js-presets`, `build-tests`, (done) => {
  server.reload();
  done();
}));

gulp.task(`assemble`, gulp.series(`clean`, `copy`, `style`, `style-prism`));

gulp.task(`serve`, gulp.series(`assemble`, () => {
  server.init({
    server: `./build`,
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(`sass/**/*.{scss,sass}`, gulp.series(`style`));
  gulp.watch(`*.html`, gulp.series(`copy-html`));
  gulp.watch(`src/**/*.js`, gulp.series(`js-watch`));
}));

gulp.task(`build`, gulp.series(`assemble`, `imagemin`));
