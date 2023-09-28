"use strict";

const express = require("express");
const router = express.Router();

module.exports = (model, service) => {
  // Import the Profile model
  let { User } = require("../../models");
  if (model) User = model;

  // Import the profileService
  const { UserService } = require("../../services");

  // Inject the model into the service
  let userService;
  if (service) userService = service; // test will be a function
  else userService = new UserService(model); // production will be an object

  // Import the profileController and inject the service
  const { userController } = require("../../controllers/")(userService);

  // Route for creating a new user
  router.post("/", userController.create);

  router.post("/signin", userController.authenticate);

  // Route for logging out the user
  router.get("/logout", userController.logout);

  // Route for retrieving user information by userId
  router.get("/:userId", userController.readById);

  // Route for retrieving a list of all users
  router.get("/", userController.readAll);

  // Route for updating user information by userId
  router.patch("/:userId", userController.update);

  // Route for deleting a user by userId
  router.delete("/:userId", userController.delete);

  return router;
};
