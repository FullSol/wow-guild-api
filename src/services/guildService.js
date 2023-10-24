"use strict";

const BaseService = require("./baseService");
const { AuthorizationCode } = require("simple-oauth2");

class GuildService extends BaseService {
  constructor(repo, oAuthClient) {
    super(repo);
    this.oAuthClient = oAuthClient;
  }

  upsert = async (newGuild) => {
    console.log(newGuild);
    try {
      // // Validate the new playable class
      //   const { error } = this.createSchema.validate(newGuild);
      //
      // // Check for errors in the validation
      //   if (error) {
      //     throw new AggregateValidationError(
      //       this._createErrorsArray(error),
      //       "Unable to validate the guild"
      //     );
      //   }

      // Attempt to save the new guild
      const result = await this.Repo.upsert(newGuild);

      // Return the  result
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };
}

module.exports = GuildService;
