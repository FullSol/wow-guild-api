"use strict";

const logger = require("../logger");
const {
  AggregateValidationError,
  SequelizeUniqueConstraintError,
  ResourceNotFoundError,
  AuthenticationFailureError,
} = require("../errors/custom");

class BaseService {
  constructor(repo, createSchema, updateSchema) {
    this.logger = logger;
    this.Repo = repo;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }

  _createErrorsArray = (error) => {
    return error.details.map((e) => e.message);
  };

  _handleServiceError = (serviceName, methodName, error) => {
    /**
     * SequelizeUniqueConstraintError exposes the password when reporting the error
     */
    if (error.name === "SequelizeUniqueConstraintError") {
      // remove the password from the errors array
      error.errors[0].instance.password = "password removed for security";
    }
    this.logger.info(`${serviceName}: ${methodName}`);
    this.logger.error(error);
    throw error;
  };

  setCreateSchema = (createSchema) => {
    this.createSchema = createSchema;
  };

  setUpdateSchema = (updateSchema) => {
    this.updateSchema = updateSchema;
  };
}

module.exports = BaseService;
