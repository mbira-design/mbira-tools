#!/usr/bin/env node

"use strict";

const gulp = require("gulp");
const chalk = require("chalk");

const args = process.argv.slice(2);

const SCRIPTS = ["build", "compile", "dist", "dist-style", "clean"];
const scriptIndex = args.findIndex((x) => SCRIPTS.includes(x));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

function runTask(taskName) {
  const task = gulp.task(taskName);
  if (task === undefined) {
    console.log(
      new Date(),
      chalk.red("[ERROR]"),
      "Unknown task:",
      chalk.bgWhite.black(taskName)
    );
    return;
  }
  task.apply(gulp);
}

if (SCRIPTS.includes(script)) {
  console.log(new Date(), chalk.cyan("[mbira-tools]"), chalk.yellow(script));
  require("../gulpfile");
  runTask(script);
} else {
  console.log(
    new Date(),
    chalk.red("[ERROR]"),
    "Unknown script:",
    chalk.bgWhite.black(script)
  );
}
