"use strict";

const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.get("/signin", controller.signinForm.bind(controller));
  router.get("/user/:username", controller.readByUsername.bind(controller));
  return router;
};
