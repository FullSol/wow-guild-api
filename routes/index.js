"use strict";
// Import Models
const { User } = require("../models");

// Import Services
const { UserService } = require("../services");

// Instantiate services with their models
const userService = new UserService(User);

// Import controllers
const { indexController, userController } =
  require("../controllers")(userService);

// Set routes for the application
module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
  app.use("/api/v1/users", userController);
};
