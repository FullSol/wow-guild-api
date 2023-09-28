const userController = require("./userController");
const profileController = require("./profileController");

module.exports = (service) => {
  return {
    userController: userController(service),
    profileController: profileController(service),
  };
};
