"use strict";

const {
  createSchema,
  updateSchema,
} = require("../validations/userValidations");
const BaseService = require("./baseService");

class ProfileService extends BaseService {
  constructor(repo) {
    super(repo, createSchema, updateSchema);
  }

  readOneByUser = () => {};

  update = (id) => {};
}

module.exports = ProfileService;
