/* eslint-env node */

const del = require(`del`);
const gulp = require(`gulp`);
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
const rollup = require(`gulp-better-rollup`);
const uglify = require(`gulp-uglify`);
const sourcemaps = require(`gulp-sourcemaps`);
const concat = require(`gulp-concat`);
// const mocha = require(`gulp-mocha`);
const debug = require(`gulp-debug`);
const KarmaServer = require(`karma`).Server;

gulp.task(`style`, () => {
  return gulp.src(`sass/**/*.{css,scss,sass}`)
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
      .pipe(minify())
      .pipe(rename(`style.min.css`))
      .pipe(gulp.dest(`build/css`));
});

gulp.task(`build-scripts`, () => {
  return gulp.src([`js/index.js`, `js/index-silent.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(rollup({
        plugins: [
          nodeResolve(),
          commonjs(),
          babel({
            babelrc: false,
            exclude: [`node_modules/**`, `js/tests/**`],
            presets: [
              [`env`, {modules: false}]
            ],
            plugins: [`external-helpers`]
          })
        ]
      }, `iife`))
      .pipe(uglify())
      .pipe(sourcemaps.write(``))
      .pipe(gulp.dest(`build/js`));
});

gulp.task(`build-js-presets`, () => {
  return gulp.src([`js/presets/**/*.js`])
      .pipe(debug({title: `debug`}))
      .pipe(plumber())
      .pipe(rollup({
        plugins: [
          nodeResolve(),
          commonjs(),
          babel({
            babelrc: false,
            presets: [
              [`env`, {modules: false}]
            ],
            plugins: [`external-helpers`]
          })
        ]
      }, `iife`))
      .pipe(uglify())
      .pipe(gulp.dest(`build/js/presets`));
});

gulp.task(`build-tests`, () => {
  return gulp.src([`js/tests/**/*.js`])
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
  // return gulp
  //     .src([`js/**/*.test.js`], {
  //       read: false
  //     })
  //     .pipe(mocha({
  //       compilers: [`js:babel-register`],
  //       reporter: `spec`
  //     }));
  new KarmaServer({
    configFile: __dirname + `/karma.conf.js`,
    // singleRun: true,
    debug: true
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

gulp.task(`copy`, gulp.series(`copy-html`, `build-scripts`, `build-js-presets`, `build-tests`, `style`, () => {
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

// gulp.task(`examples`, () => {
//   return gulp.src(`index.html`).pipe(gulp.dest(`examples`));
// });

gulp.task(`clean`, () => {
  return del(`build`);
});

gulp.task(`js-watch`, gulp.series(`build-scripts`, `build-js-presets`, `build-tests`, (done) => {
  server.reload();
  done();
}));

gulp.task(`assemble`, gulp.series(`clean`, `copy`, `style`));

gulp.task(`serve`, gulp.series(`assemble`, () => {
  server.init({
    server: `./build`,
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(`sass/**/*.{scss,sass}`, gulp.series(`style`));
  gulp.watch(`*.html`).on(`change`, gulp.series(`copy-html`));
  gulp.watch(`js/**/*.js`, gulp.series(`js-watch`));
}));

gulp.task(`test-watch`, gulp.series(`assemble`, `test:noerror`, () => {
  gulp.watch(`sass/**/*.{scss,sass}`, gulp.series(`style`));
  gulp.watch(`*.html`).on(`change`, (e) => {
    if (e.type !== `deleted`) {
      gulp.series(`copy-html`);
    }
  });
  gulp.series(`test`);
  gulp.watch(`js/**/*.js`, gulp.series(`build-tests`));
}));
gulp.task(`build`, gulp.series(`assemble`, `imagemin`));
