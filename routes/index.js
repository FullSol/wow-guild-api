// // Profiles
// const ProfileService = require("../services/profileService");
// const { Profile } = require("../models");
// const profileService = new ProfileService(Profile);
// const profileController = require("../controllers/profileController")(
//   profileService
// );

// Index
const indexController = require("../controllers/index");

module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
  //   app.use("/api/v1/profiles", profileController);
};
