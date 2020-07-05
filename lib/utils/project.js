const fs = require("fs");
const path = require("path");

const cwd = process.cwd();

function getProjectPath(...filePath) {
  return path.join(cwd, ...filePath);
}

function getConfig() {
  const configPath = getProjectPath(".mbira-tools.config.js");
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }
  return {};
}

module.exports = {
  getProjectPath,
  getConfig,
};
