"use strict";

const {
  ResourceNotFoundError,
  AggregateValidationError,
} = require("../errors/custom");
const { ProfileUpdateSchema: updateSchema } = require("../validations");
const BaseService = require("./baseService");

class ProfileService extends BaseService {
  constructor(repo) {
    super(repo, undefined, updateSchema);
  }

  /**
   *@description Finds and returns a Profile object based on a user's id
   * @param {string} userId
   * @returns {Object} Profile
   */
  read = async (userId) => {
    try {
      // Check for ID
      if (userId === null || userId === undefined)
        throw new Error("Valid User ID must be provided.");

      // Attempt to retrieve the profile from the DB
      const result = await this.Repo.findAll({ where: { userId: userId } });

      // Check for resource
      if (result[0] === null)
        throw new ResourceNotFoundError("Resource not found");

      const profile = result[0];

      // Return the result
      return profile;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "read", error);
    }
  };

  /**
   * @description Updates an existing profile
   * @param {Object} updatedProfile
   * @returns
   */
  update = async (updatedProfile) => {
    try {
      // Pull the userId from the object & create profileWithoutId
      const { userId, ...profileWithoutUserId } = updatedProfile;

      // validate the the profileWithoutUpdate
      const { error } = this.updateSchema.validate(profileWithoutUserId);

      // Check for validation errors
      if (error)
        throw new AggregateValidationError(
          this._createErrorsArray(error),
          "Unable to validate the profile for updating."
        );

      // Attempt to update the profile
      const result = await this.Repo.update(profileWithoutUserId, {
        where: { userId: userId },
      });

      // Check if any rows were updated
      if (result[0] === 0) {
        throw new ResourceNotFoundError("Profile not found for updating.");
      }

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "update", error);
    }
  };
}

module.exports = ProfileService;
