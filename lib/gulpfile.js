const {
  getProjectPath,
  getConfig,
  getTsConfig,
  getBabelConfig,
} = require("./utils");

const gulp = require("gulp");
const chalk = require("chalk");
const del = require("del");
const ts = require("gulp-typescript");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const merge2 = require("merge2");

const config = getConfig();
const tsConfig = getTsConfig();
const tsCompilerOptions = tsConfig.compilerOptions;

const SRC_DIR_NAME = config.SRC_DIR || "src";
const ESM_DIR_NAME = config.ESM_DIR || "es";
const LIB_DIR_NAME = config.LIB_DIR || "lib1";
const DIST_DIR_NAME = config.DIST_DIR || "dist";

const SRC_DIR = getProjectPath(SRC_DIR_NAME);
const ESM_DIR = getProjectPath(ESM_DIR_NAME);
const LIB_DIR = getProjectPath(LIB_DIR_NAME);
const DIST_DIR = getProjectPath(DIST_DIR_NAME);
const STYLE_SOURCE_DIR = config.STYLE_SOURCE_DIR || [
  `${SRC_DIR_NAME}/**/*.less`,
];
const TS_SOURCE = config.SOURCE || [
  `${SRC_DIR_NAME}/**/*.tsx`,
  `${SRC_DIR_NAME}/**/*.ts`,
  `!${SRC_DIR_NAME}/**/*.d.ts`,
];

function clean(cb) {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("clean")
  );
  del.sync([LIB_DIR, ESM_DIR, DIST_DIR], { force: true });
  cb();
}

function cleanLib(cb) {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("cleanLib")
  );
  del.sync([LIB_DIR], { force: true });
  cb();
}

function cleanEsm(cb) {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("cleanEsm")
  );
  del.sync([ESM_DIR], { force: true });
  cb();
}

function cleanDist(cb) {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("cleanDist")
  );
  del.sync([DIST_DIR], { force: true });
  cb();
}

function buildLib() {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("buildLib")
  );
  const tsResult = compileTs();
  const dts = tsResult.dts.pipe(gulp.dest(LIB_DIR));
  const lib = tsResult.js
    .pipe(babel(getBabelConfig()))
    .pipe(gulp.dest(LIB_DIR));
  return merge2([lib, dts]);
}

function buildEsm() {
  console.log(
    new Date(),
    chalk.cyan("[mbira-tools]"),
    "Task:",
    chalk.yellow("buildEsm")
  );
  const tsResult = compileTs();
  const dts = tsResult.dts.pipe(gulp.dest(ESM_DIR));
  const esm = tsResult.js
    .pipe(
      babel(
        getBabelConfig(null, {
          NODE_ENV: "esm",
        })
      )
    )
    .pipe(gulp.dest(ESM_DIR));
  return merge2([esm, dts]);
}

function compileTs() {
  return gulp.src(TS_SOURCE).pipe(ts(tsCompilerOptions));
}

function buildLess() {
  return gulp
    .src(STYLE_SOURCE_DIR)
    .pipe(
      less({
        javascriptEnabled: true,
      })
    )
    .pipe(postcss([require("autoprefixer")]))
    .pipe(concat("style.css"))
    .pipe(gulp.dest(DIST_DIR));
}

function buildMinCss() {
  return gulp
    .src(`${DIST_DIR}/style.css`)
    .pipe(postcss([require("cssnano")]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(DIST_DIR));
}

gulp.task("clean", gulp.series(clean));

gulp.task("dist-style", gulp.series(cleanDist, buildLess, buildMinCss));

gulp.task(
  "compile",
  gulp.series(
    gulp.parallel(cleanLib, cleanEsm),
    gulp.parallel(buildLib, buildEsm)
  )
);
