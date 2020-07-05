const fs = require("fs");
const { getProjectPath } = require("./project");

function getBabelConfig(api, options) {
  let babelConfig = {};

  if (fs.existsSync(getProjectPath(".babelrc.js"))) {
    const customBabelConfig = require(getProjectPath(".babelrc.js"));
    babelConfig = customBabelConfig(api, options);
  } else {
    const { NODE_ENV } = options || process.env;
    const development = NODE_ENV === "development";
    const modules = NODE_ENV === "esm" ? false : "commonjs";

    if (api) {
      api.cache(() => NODE_ENV);
    }

    const plugins = [
      [
        "@babel/plugin-transform-typescript",
        {
          isTSX: true,
        },
      ],
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true,
        },
      ],
    ];

    if (modules) {
      plugins.push("add-module-exports");
    }

    babelConfig = {
      presets: [
        ["@babel/preset-env", { modules, loose: true }],
        ["@babel/preset-react", { development }],
      ],
      plugins,
    };
  }

  return babelConfig;
}

module.exports = {
  getBabelConfig,
};
