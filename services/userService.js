"use strict";

const bcrypt = require("bcrypt");
const logger = require("../log/logger");
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
      const result = await this.Repo.findAll({
        where: {
          username: username,
          password: {
            [Op.eq]: Sequelize.literal(`'${password}'`),
          },
        },
      });
      if (result <= 1) console.log("user found");
      else console.log("no user found");
    } catch (error) {
      logger.info("user service: authenticate");
      logger.error(error.message);
      throw error;
    }
  };

  create = async (resourceData) => {
    try {
      // Validate the incoming data
      const { error } = this.createSchema.validate(resourceData);

      if (error) {
        throw new AggregateValidationError(
          createErrorsArray(error),
          "Unable to validate the submitted resource"
        );
      }

      // Hash the password
      const hash = await bcrypt.hash(resourceData.password, saltRounds);

      // Update the resourceData with the hashed password
      resourceData.password = hash;

      // Attempt to insert the new object
      const result = await this.Repo.create(resourceData);

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
