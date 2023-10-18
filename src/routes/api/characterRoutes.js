"use strict";

const express = require("express");
const router = express.Router();
const isProtected = require("../../middlewares/isProtected");

module.exports = (controller) => {
  // Enable protection for all routes below this line
  router.use(isProtected);

  // Route for retrieving a list of all characters
  router.get("/", controller.readAllUserCharacters.bind(controller));

  return router;
};
