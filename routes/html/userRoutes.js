"use strict";

const express = require("express");
const router = express.Router();

module.exports = (userController) => {
  // Route for displaying the user update form
  router.get("/update", userController.getUpdateForm.bind(userController));

  // Route for displaying the user registration form
  router.get("/signup", userController.getSignUpForm.bind(userController));

  // Route for displaying the user login form
  router.get("/signin", userController.getSignInForm.bind(userController));

  return router;
};
