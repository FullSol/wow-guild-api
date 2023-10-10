"use strict";

const logger = require("../logger");

class BaseService {
  constructor(repo, createSchema, updateSchema) {
    this.logger = logger;
    this.Repo = repo;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }

  _createErrorsArray = (error) => {
    try {
      const message = [];
      error.details.forEach((e) => {
        message.push(e.message);
      });
      return message;
    } catch (error) {
      // Throw error for future handling
      throw error;
    }
  };

  setCreateSchema = (createSchema) => {
    this.createSchema = createSchema;
  };

  setUpdateSchema = (updateSchema) => {
    this.updateSchema = updateSchema;
  };
}

module.exports = BaseService;
