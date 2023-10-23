"use strict";

const BaseService = require("./baseService");

class PlayableClassService extends BaseService {
  constructor(service) {
    super(service);
  }

  upsert = async (newPlayableClass) => {
    try {
      // // Validate the new playable class
      //   const { error } = this.createSchema.validate(newPlayableClass);
      //
      // // Check for errors in the validation
      //   if (error) {
      //     throw new AggregateValidationError(
      //       this._createErrorsArray(error),
      //       "Unable to validate the realm"
      //     );
      //   }

      // Attempt to save the new realm
      const result = await this.Repo.upsert(newPlayableClass);

      // Return the  result
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };
}

module.exports = PlayableClassService;
