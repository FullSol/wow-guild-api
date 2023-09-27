const indexController = require("./indexController");
const userController = require("./userController");
const profileController = require("./profileController");

module.exports = (service) => {
  return {
    indexController: indexController(service),
    userController: userController(service),
    profileController: profileController(service),
  };
};
