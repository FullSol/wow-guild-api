"use strict";

const logger = require("../logger");

class BaseService {
  constructor(repo, createSchema, updateSchema) {
    this.logger = logger;
    this.Repo = repo;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }

  setUpdateSchema = (updateSchema) => {
    this.updateSchema = updateSchema;
  };
}

module.exports = BaseService;
