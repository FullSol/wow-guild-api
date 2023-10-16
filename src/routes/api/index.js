const express = require("express");
const userApiRoutes = require("./userRoutes");
const profileApiRoutes = require("./profileRoutes");

const router = express.Router();

// Import the models
const { User, Profile } = require("../../models");

// Import the services
const { UserService, ProfileService } = require("../../services");

// Inject models into the services
const userService = new UserService(User);
const profileService = new ProfileService(Profile);

// Import the controllers
const { UserController, ProfileController } = require("../../controllers/");

// Inject services into the controllers
const userController = new UserController(userService);
const profileController = new ProfileController(profileService);

router.use("/users", userApiRoutes(userController));
router.use("/profiles", profileApiRoutes(profileController));

module.exports = router;
