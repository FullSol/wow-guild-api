"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const isProtected = require("../../middlewares/isProtected");

module.exports = (controller) => {
  // Route for authenticating a user
  router.post("/signin", controller.authenticate.bind(controller));

  // Route for logging out the user
  router.get("/logout", controller.logout.bind(controller));

  // Route for creating a new user
  router.post("/", controller.create.bind(controller));

  // Enable protection for all routes below this line
  router.use(isProtected);

  // Route for retrieving a list of all users
  router.get("/", controller.readAll.bind(controller));

  // Route for retrieving user information by userId
  router.get("/:userId", controller.readById.bind(controller));

  // Route for updating user information by userId
  router.patch("/:userId", controller.update.bind(controller));

  // Route for deleting a user by userId
  router.delete("/:userId", controller.delete.bind(controller));

  // Route to authenticate user on bnet
  router.get("/auth/bnet", controller.authBnet.bind(controller));

  // Route for bnet callback
  router.get(
    "/auth/bnet/callback",
    passport.authenticate("bnet", { failureRedirect: "/" }),
    function (req, res) {
      res.redirect("/");
    }
  );

  return router;
};
