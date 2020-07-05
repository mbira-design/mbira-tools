const fs = require("fs");
const { getProjectPath } = require("./project");

function getTsConfig() {
  let tsConifg = {
    compilerOptions: {},
  };
  if (fs.existsSync(getProjectPath("tsconfig.json"))) {
    tsConifg = require(getProjectPath("tsconfig.json"));
  }
  tsConifg.compilerOptions = Object.assign(
    {
      noUnusedParameters: true,
      noUnusedLocals: true,
      strictNullChecks: true,
      target: "es6",
      jsx: "preserve",
      moduleResolution: "node",
      declaration: true,
      allowSyntheticDefaultImports: true,
    },
    tsConifg.compilerOptions
  );
  return tsConifg;
}

module.exports = {
  getTsConfig,
};
