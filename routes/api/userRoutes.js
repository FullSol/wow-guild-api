"use strict";

const express = require("express");
const router = express.Router();

// Import the User model
const { User } = require("../../models");

// Import the userService
const { UserService } = require("../../services");

// Inject the model into the service
const userService = new UserService(User);

// Import the userController and inject the service
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

module.exports = router;
