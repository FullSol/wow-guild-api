"use strict";

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
      default:
        res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
        break;
    }
  }

  return {
    getUserProfile: async (req, res) => {
      try {
        const profile = await service.readOneByUser(req.params.userId);
        res.status(200).json(profile);
      } catch (error) {
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
    updateUserProfile: async (req, res) => {
      try {
        const { userId } = req.params;
        if (userId === null) throw new Error("invalid ID request");
        await service.update(userId, req.body);
        res.status(200).send("User profile successfully updated.");
      } catch (error) {
        logger.error(error.message);
        errorHandler(req, res, error);
      }
    },
  };
};
