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

  router.post("/", async (req, res) => {
    try {
      await service.create(req.body);
      res.status(201).send({ message: "Profile created successfully" });
    } catch (error) {
      logger.info("profile controller: create");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.get("/", async (req, res) => {
    try {
      const response = await service.readAll();
      res.status(200).json(response);
    } catch (error) {
      logger.info("profile controller: get all");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");
      const result = await service.readOne(id);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log("I SHOULD BE HERE");
      logger.info("profile controller: get one");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");
      const result = await service.update(id, req.body);
      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      logger.info("profile controller: patch");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (id === null || isNaN(id)) throw new Error("invalid ID request");
      const result = await service.destroy(id, req.body);
      if (result === 0)
        res.status(404).send({ message: "no resource found for deletion." });
      res.status(200).json(result);
    } catch (error) {
      logger.info("profile controller: delete");
      logger.error(error.message);
      errorHandler(req, res, error);
    }
  });

  return router;
};
