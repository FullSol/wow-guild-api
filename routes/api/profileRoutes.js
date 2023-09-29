"use strict";

const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  // Route for retrieving profile information by userId
  router.get("/:userId", controller.getProfile.bind(controller));

  // Route for updating profile information by userId
  router.patch("/:userId", controller.updateProfile.bind(controller));

  return router;
};
