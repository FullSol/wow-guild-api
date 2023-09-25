const indexController = require("./indexController");
const userController = require("./userController");

module.exports = (service) => {
  return {
    indexController: indexController(service),
    userController: userController(service),
  };
};
