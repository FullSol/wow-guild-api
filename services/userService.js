"use strict";

const bcrypt = require("bcrypt");
const logger = require("../logger");
const saltRounds = 10; // Number of salt rounds for hashing
const {
  createSchema,
  updateSchema,
} = require("../validations/userValidations");
const { Op, Sequelize } = require("sequelize");

const {
  AggregateValidationError,
  SequelizeUniqueConstraintError,
  ResourceNotFoundError,
  AuthenticationFailureError,
} = require("../errors/custom");

const createErrorsArray = (error) => {
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

class UserService {
  constructor(repo) {
    this.Repo = repo;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
  }

  setCreateSchema = (createSchema) => {
    this.createSchema = createSchema;
  };

  setUpdateSchema = (updateSchema) => {
    this.updateSchema = updateSchema;
  };

  authenticate = async (user) => {
    try {
      const { username, password } = user;

      // Retrieve the user from the DB based on the username alone
      const users = await this.Repo.scope("withPassword").findAll({
        where: {
          username: username,
        },
      });

      // Check if a user with the provided username exists
      if (users.length === 0) {
        throw new Error("User not found");
      }

      const storedUser = users[0];

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, storedUser.password);

      if (isMatch) return storedUser; // Accept authentication
      else
        throw new AuthenticationFailureError(
          "Username or Password not recognized"
        ); // Reject authentication
    } catch (error) {
      logger.info("user service: authenticate");
      logger.error(error.message);
      throw error;
    }
  };

  create = async (resourceData) => {
    try {
      const { username, password, repeat_password, email } = resourceData;

      // Validate the incoming data
      const { error } = this.createSchema.validate({
        username,
        password,
        repeat_password,
        email,
      });

      if (error) {
        throw new AggregateValidationError(
          createErrorsArray(error),
          "Unable to validate the submitted resource"
        );
      }

      // Hash the password
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Attempt to insert the new object
      const result = await this.Repo.create({
        username,
        password: password_hash,
        email,
      });

      // Return the results
      return result;
    } catch (error) {
      logger.info("user service: create");
      logger.error(error.message);
      if (error.name === "SequelizeUniqueConstraintError") {
        delete error.errors[0].instance.password;
        error.errors[0].instance.password = undefined;
        throw new SequelizeUniqueConstraintError(error.errors, error.message);
      }

      throw error;
    }
  };

  readAll = async () => {
    try {
      // Attempt to retrieve information from the DB
      const result = await this.Repo.findAll();

      // Return the results
      return result;
    } catch (error) {
      logger.info("user service: read all");
      logger.error(error.message);
      throw error;
    }
  };

  readOne = async (id) => {
    try {
      // Check for valid id
      if (id === null || isNaN(id))
        throw new Error("Resource ID must be numerical");

      // Attempt to retrieve information from the DB
      const result = await this.Repo.findByPk(id);
      if (result === null)
        throw new ResourceNotFoundError("Resource not found");
      // Return the results
      return result;
    } catch (error) {
      logger.info("user service: read one");
      logger.error(error.message);
      throw error;
    }
  };

  update = async (id, resourceData) => {
    try {
      // Check for valid id
      if (id === null || isNaN(id))
        throw new Error("Resource ID must be numerical");

      // validate the incoming data
      const { error } = this.updateSchema.validate(resourceData);

      // If there was a validation error throw a ew validation error with error message
      if (error)
        throw new AggregateValidationError(
          createErrorsArray(error),
          "Unable to validate the submitted resource"
        );

      // Attempt to update information in the DB
      const result = await this.Repo.update(resourceData, {
        where: {
          id: id,
        },
      });

      if (result[0] === 0)
        throw new ResourceNotFoundError("Resource not found");

      // Return the results
      return result;
    } catch (error) {
      logger.info("user service: update");
      logger.error(error.message);
      throw error;
    }
  };

  delete = async (id) => {
    try {
      // Check for valid id
      if (id === null || isNaN(id))
        throw new Error("Resource ID must be numerical");

      // Attempt to delete information from the DB
      const result = this.Repo.destroy({ where: { id: id } });

      // Return the results
      return result;
    } catch (error) {
      logger.info("user service: delete");
      logger.error(error.message);
      throw error;
    }
  };
}

module.exports = UserService;
