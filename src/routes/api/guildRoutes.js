"use strict";

const express = require("express");
const router = express.Router();
const isProtected = require("../../middlewares/isProtected");

module.exports = (controller) => {
  // Enable protection for all routes below this line
  router.use(isProtected);

  // Router for retrieving all guilds
  router.get("/", controller.readAll.bind(controller));

  return router;
};
