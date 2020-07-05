const project = require("./project");
const typescript = require("./typescript");
const babel = require("./babel");

module.exports = {
  ...project,
  ...typescript,
  ...babel,
};
