"use strict";
// Models
const { Profile } = require("../models");

// Services
const { ProfileService } = require("../services/");

// Instantiate services with their models as dependency injection
const profileService = new ProfileService(Profile);

// Provide controller's service
const profileController = require("../controllers/profileController")(
  profileService
);
const indexController = require("../controllers/index");

// Set routes for the application
module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
  app.use("/api/v1/profiles", profileController);
};
