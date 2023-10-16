"use strict";

const express = require("express");
const router = express.Router();
const isProtected = require("../../middlewares/isProtected");

module.exports = (controller) => {
  // Route for retrieving profile information by userId
  router.get("/:userId", controller.getProfile.bind(controller));

  // Enable protection for all routes below this line
  router.use(isProtected);

  // Route for updating profile information
  router.patch("/", controller.updateProfile.bind(controller));

  return router;
};
