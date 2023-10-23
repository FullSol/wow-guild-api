"use strict";

const express = require("express");
const router = express.Router();
const isProtected = require("../../middlewares/isProtected");

module.exports = (controller, passport) => {
  // Route for authenticating a user
  router.post("/signin", controller.authenticate.bind(controller));

  // Route for logging out the user
  router.get("/signout", controller.signout.bind(controller));

  // Route for creating a new user
  router.post("/", controller.create.bind(controller));

  // Route for retrieving user information by userId
  router.get("/:userId", controller.readById.bind(controller));

  // Enable protection for all routes below this line
  router.use(isProtected);

  // Route for retrieving a list of all users
  router.get("/", controller.readAll.bind(controller));

  // Route for updating user information by userId
  router.patch("/", controller.update.bind(controller));

  // Route for deleting a user by userId
  router.delete("/:userId", controller.delete.bind(controller));

  // bnet auth
  const uniqueValue = Math.random().toString(36).substring(7);
  router.get(
    "/auth/bnet",
    passport.authenticate("bnet", { state: uniqueValue })
  );

  // bnet callback
  router.get(
    "/auth/bnet/callback",
    passport.authenticate("bnet", { failureRedirect: "/" }),
    controller.handleBnetCallback.bind(controller)
  );

  return router;
};
