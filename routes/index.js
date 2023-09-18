"use strict";

// Index
const indexController = require("../controllers/index");

module.exports = (app) => {
  app.use("/", indexController);
  app.use("/api/v1/", indexController);
};
