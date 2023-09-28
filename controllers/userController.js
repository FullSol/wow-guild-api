"use strict";

const { ResourceNotFoundError } = require("../errors/custom");
const logger = require("../logger");
const regexExp =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}(?:\/.*)?$/i;

module.exports = (service) => {
  const errorHandler = (req, res, error) => {
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
      default:
        res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
        break;
    }
  };

  return {
    getUpdateForm: async (req, res) => {
      try {
        const { id } = req.params;
        const user = await service.readOne(id);
        res.render("users/update", { user: user });
      } catch (error) {
        logger.info("user controller: update/:id");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    getSignUpForm: async (req, res) => {
      res.render("users/register", { title: "User Registration" });
    },
    getSignInForm: async (req, res) => {
      res.render("users/signin", { title: "User Login" });
    },
    authenticate: async (req, res) => {
      console.log("here");
      try {
        const { username, password } = req.body;

        const user = await service.authenticate({
          username: username,
          password: password,
        });

        req.session.user = user;
        res.status(200).json({ message: "Login successful" });
      } catch (error) {
        logger.info("index controller: login");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    logout: async (req, res) => {
      try {
        logger.info(`${req.session.user} has logged out.`);
        req.session.destroy;
        const acceptedHeader = req.get("Accept").split(",");
        if (acceptedHeader[0] === "text/html") res.redirect("/");
        else res.send("User  has been logged out");
      } catch (error) {
        logger.info("index controller: logout");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    create: async (req, res) => {
      try {
        // Attempt to create a new user
        const result = await service.create(req.body);

        // Send response
        res.status(201).json(result);
      } catch (error) {
        logger.info("user controller: create");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    readAll: async (req, res) => {
      try {
        const response = await service.readAll();
        res.status(200);
        const acceptedHeader = req.get("Accept").split(",");
        if (acceptedHeader[0] === "text/html")
          res.render("users/readAll", { users: response });
        else res.json(response);
      } catch (error) {
        logger.info("user controller: get all");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    readById: async (req, res) => {
      try {
        const { userId } = req.params;
        if (userId === null || !regexExp.test(userId))
          throw new ResourceNotFoundError("Valid user id is required");
        const response = await service.readOne(userId);
        const acceptedHeader = req.get("Accept").split(",");
        res.status(200);
        if (acceptedHeader[0] === "text/html")
          res.render("users/read", { user: response });
        else res.json(response);
      } catch (error) {
        console.log(error);
        logger.info("user controller: get one");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    update: async (req, res) => {
      try {
        const { userId } = req.params;
        if (userId === null || !regexExp.test(userId))
          throw new Error("invalid ID request");
        console.log(req.body);
        const result = await service.update(userId, req.body);

        res.status(200);

        const acceptedHeader = req.get("Accept").split(",");

        if (acceptedHeader[0] === "text/html") {
          res.send();
        } else {
          res.json(result);
        }
      } catch (error) {
        logger.info("user controller: patch");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    delete: async (req, res) => {
      try {
        const { userId } = req.params;
        if (userId === null || !regexExp.test(userId))
          throw new Error("invalid ID request");
        const result = await service.delete(userId, req.body);
        if (result === 0)
          res.status(404).send({ message: "no resource found for deletion." });
        else res.status(200).json(result);
      } catch (error) {
        logger.info("user controller: delete");
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
  };
};
