const userDTOs = require("./user");
const characterDTOS = require("./character");
const guildDTOS = require("./guild");

module.exports = {
  ...userDTOs,
  ...characterDTOS,
  ...guildDTOS,
};
