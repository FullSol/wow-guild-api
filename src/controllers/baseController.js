"user strict";

const logger = require("../logger");

class BaseController {
  constructor(service) {
    this.service = service;
  }

  _handleControllerError(req, res, controllerName, methodName, error) {
    // Log the error
    logger.info(`${controllerName}: ${methodName}`);
    logger.error(error);

    // Pull errors array from the error if exists
    const { errors } = error;

    // Handle the errors
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
          status: "Unauthorized",
          message: "Username or password not recognized",
        });
        break;
      default:
        res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
        break;
    }
  }
}

module.exports = BaseController;
