const express = require("express");
const router = express.Router();
const logger = require("../logger");

module.exports = (service) => {
  function errorHandler(req, res, error) {
    const { errors } = error;
    switch (error.name) {
      case "ValidationError":
        res.status(400).send({
          status: "error",
          message: "Unable to process request due to validation failure",
          data: { errors },
        });
        break;
      case "SequelizeUniqueConstraintError":
        res.status(422).send({
          status: "Unique Constraint Error",
          message: error.message,
          data: { errors },
        });
        break;
      case "ResourceNotFoundError":
        res.status(404).send({
          status: "ResourceNotFoundError",
          message: error.message,
        });
        break;
      case "AuthenticationFailureError":
        res.status(401).send({
          status: "AuthenticationFailureError",
          message: error.message,
        });
        break;
      default:
        res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
        break;
    }
  }

  router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
  });

  router.get("/register", async (req, res) => {
    res.render("users/register", { title: "User Registration" });
  });

  router.post("/register", async (req, res) => {
    try {
      // Attempt to create a new user
      const result = await service.create(req.body);

      // Send response
      res.status(201).json(result);
    } catch (error) {
      logger.info("index controller: register");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.get("/login", async (req, res) => {
    res.render("users/login", { title: "User Login" });
  });

  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await service.authenticate({
        username: username,
        password: password,
      });

      req.session.user = user;
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.log(error);
      logger.info("index controller: register");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  return router;
};
