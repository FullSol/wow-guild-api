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

// Route for displaying the user update form
router.get("/update", userController.getUpdateForm);

// Route for displaying the user registration form
router.get("/signup", userController.getSignUpForm);

// Route for displaying the user login form
router.get("/signin", userController.getSignInForm);

module.exports = router;
