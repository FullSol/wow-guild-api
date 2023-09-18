"use strict";

const {
  createSchema,
  updateSchema,
} = require("../validations/profileValidations");

class AggregateValidationError extends AggregateError {
  constructor(arg1, arg2) {
    super(arg1, arg2);
    this.name = "ValidationError";
  }
}

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

class ProfileService {
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

  create = async (resourceData) => {
    try {
      // validate the incoming data
      const { error } = this.createSchema.validate(resourceData);

      // If there was a validation error throw a ew validation error with error message
      if (error)
        throw new AggregateValidationError(
          createErrorsArray(error),
          "Unable to validate the submitted resource"
        );

      // Attempt to insert the new object
      const result = this.Repo.create(resourceData);

      // Return the results
      return result;
    } catch (error) {
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
      throw error;
    }
  };

  readOne = async (id) => {
    // Check for valid id
    if (id === null || isNaN(id))
      throw new Error("Resource ID must be numerical");

    // Attempt to retrieve information from the DB
    const result = this.Repo.findByPk(id);

    // Return the results
    return result;
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
      const result = this.Repo.update({ resourceData, where: { id: id } });

      // Return the results
      return result;
    } catch (error) {
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
      throw error;
    }
  };
}

module.exports = ProfileService;
