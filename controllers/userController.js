"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../log/logger");

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

  router.get("/create", async (req, res) => {
    try {
      res.render("users/create");
    } catch (error) {
      logger.info("user controller: create");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.get("/update/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await service.readOne(id);
      res.render("users/update", { user: user });
    } catch (error) {
      logger.info("user controller: update/:id");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      // Attempt to create a new user
      const result = await service.create(req.body);

      const acceptedHeader = req.get("Accept").split(",");
      res.status(201);
      if (acceptedHeader[0] === "text/html")
        res.render("users/created", { user: result });
      else res.json(result);
    } catch (error) {
      logger.info("user controller: create");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.get("/", async (req, res) => {
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
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");
      const response = await service.readOne(id);
      const acceptedHeader = req.get("Accept").split(",");
      res.status(200);
      if (acceptedHeader[0] === "text/html")
        res.render("users/read", { user: response });
      else res.json(response);
    } catch (error) {
      logger.info("user controller: get one");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");

      const result = await service.update(id, req.body);

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
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");
      const result = await service.delete(id, req.body);
      if (result === 0)
        res.status(404).send({ message: "no resource found for deletion." });
      else res.status(200).json(result);
    } catch (error) {
      logger.info("user controller: delete");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  return router;
};
