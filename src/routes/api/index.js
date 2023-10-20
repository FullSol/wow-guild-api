const express = require("express");
const userApiRoutes = require("./userRoutes");
const profileApiRoutes = require("./profileRoutes");
const characterApiRoutes = require("./characterRoutes");

const router = express.Router();

// Import the models
const { User, Profile, Character } = require("../../models");

// Import the services
const {
  UserService,
  ProfileService,
  CharacterService,
} = require("../../services");

module.exports = (passport) => {
  // Inject models into the services
  const userService = new UserService(User);
  const profileService = new ProfileService(Profile);
  const characterService = new CharacterService(Character);

  // Import the controllers
  const {
    UserController,
    ProfileController,
    CharacterController,
  } = require("../../controllers/");

  // Inject services into the controllers
  const userController = new UserController(userService, passport);
  const profileController = new ProfileController(profileService);
  const characterController = new CharacterController(characterService);

  router.use("/users", userApiRoutes(userController));
  router.use("/profiles", profileApiRoutes(profileController));
  router.use("/characters", characterApiRoutes(characterController));

  return router;
};
