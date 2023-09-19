"use strict";
// Import Models
const { Profile } = require("../models");

// Import Services
const { ProfileService } = require("../services");

// Instantiate services with their models
const profileService = new ProfileService(Profile);

// Import controllers
const indexController = require("../controllers/index");
const profileController = require("../controllers/profileController")(
  profileService
);

// Set routes for the application
module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
  app.use("/api/v1/profiles", profileController);
};
