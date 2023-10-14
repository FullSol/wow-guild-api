"use strict";

const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds for hashing
const {
  createSchema,
  updateSchema,
} = require("../validations/userValidations");

const {
  AggregateValidationError,
  ResourceNotFoundError,
  AuthenticationFailureError,
} = require("../errors/custom");
const BaseService = require("./baseService");

class UserService extends BaseService {
  constructor(repo) {
    super(repo, createSchema, updateSchema);
  }

  authenticate = async (credentials) => {
    try {
      // Pull the required field from credentials
      const { username, password } = credentials;

      // Retrieve the user from the DB based on the username alone
      const users = await this.Repo.scope("withPassword").findAll({
        where: {
          username: username,
        },
      });

      // Check if a user with the provided username exists
      if (users.length === 0) {
        throw new AuthenticationFailureError(
          "Username or Password not recognized"
        );
      }

      // Pull the user from the array
      const storedUser = users[0];

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, storedUser.password);

      // Ensure the password matched
      if (!isMatch) {
        throw new AuthenticationFailureError(
          "Username or Password not recognized"
        );
      }

      // Return the store user - this still the password!
      return storedUser;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "authenticate", error);
    }
  };

  create = async (userDTO) => {
    try {
      // Validate the incoming data
      const { error } = this.createSchema.validate(userDTO);

      // Check for error with the validation
      if (error) {
        throw new AggregateValidationError(
          this._createErrorsArray(error),
          "Unable to validate the submitted resource"
        );
      }

      // Hash the password
      const password_hash = await bcrypt.hash(userDTO.password, saltRounds);

      // UserDTO with hashed password
      const userWithHashedPassword = {
        username: userDTO.username,
        password: password_hash,
        email: userDTO.email,
      };

      // Attempt to insert the new object
      const result = await this.Repo.create(userWithHashedPassword);

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };

  readById = async (id) => {
    try {
      // Attempt to retrieve information from the DB
      const result = await this.Repo.findByPk(id);

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "read", error);
    }
  };

  readByUsername = async (username) => {
    // Attempt to retrieve information from the DB
    const result = await this.Repo.findAll({ where: { username: username } });

    // Return the results
    return result[0];
  };

  readAll = async () => {
    try {
      // Attempt to retrieve information from the DB
      const result = await this.Repo.findAll();

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "readAll", error);
    }
  };

  update = async (updateUserDTO) => {
    try {
      // Pull required fields from DTO
      const { id, ...userDTOWithoutId } = updateUserDTO;

      // validate the incoming data
      const { error } = this.updateSchema.validate(userDTOWithoutId);

      // If there was a validation error throw a validation error with error message
      if (error)
        throw new AggregateValidationError(
          this._createErrorsArray(error),
          "Unable to validate the submitted resource"
        );

      // if the password is being updated hash it
      let password_hash;
      if (userDTOWithoutId.password) {
        password_hash = await bcrypt.hash(
          userDTOWithoutId.password,
          saltRounds
        );
      }

      // UserDTO with hashed password
      const userWithHashedPassword = {
        username: userDTOWithoutId.username,
        password: password_hash,
        email: userDTOWithoutId.email,
        bnetAccessToken: userDTOWithoutId.bnetAccessToken,
      };

      // Attempt to update information in the DB
      const result = await this.Repo.update(userWithHashedPassword, {
        where: {
          id: id,
        },
      });

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "update", error);
    }
  };

  delete = async (id) => {
    try {
      // Attempt to delete information from the DB
      const result = await this.Repo.destroy({ where: { id: id } });

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "delete", error);
    }
  };
}

module.exports = UserService;
