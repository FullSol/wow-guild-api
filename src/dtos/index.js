const userDTOs = require("./user");
const characterDTOS = require("./character");

module.exports = {
  ...userDTOs,
  ...characterDTOS,
};
