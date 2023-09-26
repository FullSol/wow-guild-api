"use strict";

const {
  ResourceNotFoundError,
  AggregateValidationError,
} = require("../errors/custom");
const { ProfileUpdateSchema: updateSchema } = require("../validations/");
const BaseService = require("./baseService");

class ProfileService extends BaseService {
  constructor(repo) {
    super(repo, undefined, updateSchema);
  }

  /**
   *
   * @param {uuid} userId
   * @returns {Object} Profile
   * @description Returns a user's profile
   */
  readOneByUser = async (userId) => {
    try {
      // Check for ID
      if (userId === null || userId === undefined)
        throw new Error("Valid User ID must be provided.");

      // Attempt to retrieve the profile from the DB
      const profile = await this.Repo.findAll({ where: { user_id: userId } });

      // Check for resource
      if (profile === null)
        throw new ResourceNotFoundError("Resource not found");

      // Return the result
      return profile;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  };

  update = async (updatedProfile) => {
    try {
      const { error } = this.updateSchema.validate(updatedProfile);

      if (error)
        throw new AggregateValidationError(
          this._createErrorsArray(error),
          "Unable to validate the profile for updating."
        );

      // Attempt to update the resource
      const result = await this.Repo.update(
        { battle_net: updatedProfile.battleNet },
        { where: { id: updatedProfile.id } }
      );

      // Check if any rows were updated
      if (result[0] === 0) {
        throw new ResourceNotFoundError("Profile not found for updating.");
      }

      // Return the results
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  };
}

module.exports = ProfileService;
