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
const mocha = require(`gulp-mocha`);
const debug = require(`gulp-debug`);

gulp.task(`style`, () => {
  return gulp.src(`sass/style.scss`)
      .pipe(plumber())
      .pipe(sass())
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

gulp.task(`scripts`, () => {
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
            exclude: `node_modules/**`,
            presets: [
              [`env`, {modules: false}]
            ],
            plugins: [
              `external-helpers`,
            ]
          })
        ]
      }, `iife`))
      .pipe(uglify())
      .pipe(sourcemaps.write(``))
      .pipe(gulp.dest(`build/js`));
});

gulp.task(`test`, function () {
  return gulp
      .src([`js/**/*.test.js`], {
        read: false
      })
      .pipe(mocha({
        compilers: [`js:babel-register`],
        reporter: `spec`
      }));
});

gulp.task(`copy-html`, () => {
  return gulp.src(`*.{html,ico}`)
      .pipe(gulp.dest(`build`))
      .pipe(server.stream());
});

gulp.task(`copy`, gulp.series(`copy-html`, `scripts`, `style`, () => {
  return gulp.src([
    `fonts/**/*.{woff,woff2}`,
    `img/*.*`
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

gulp.task(`js-watch`, gulp.series(`scripts`, (done) => {
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
  gulp.watch(`*.html`).on(`change`, (e) => {
    if (e.type !== `deleted`) {
      gulp.start(`copy-html`);
    }
  });
  gulp.watch(`js/**/*.js`, gulp.series(`js-watch`));
}));

gulp.task(`build`, gulp.series(`assemble`, `imagemin`));
