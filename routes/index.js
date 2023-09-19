"use strict";
// models
const { Profile } = require("../models");

// Index
const indexController = require("../controllers/index");

// Profiles
const ProfileService = require("../services/profileService");
const profileService = new ProfileService(Profile);
const profileController = require("../controllers/profileController")(
  profileService
);

module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
  app.use("/api/v1/profiles", profileController);
};
