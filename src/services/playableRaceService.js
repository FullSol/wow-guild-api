"use strict";

const BaseService = require("./baseService");

class PlayableRaceService extends BaseService {
  constructor(service) {
    super(service);
  }

  upsert = async (newPlayableRace) => {
    try {
      //   //Validate the new playable race
      //   const { error } = this.createSchema.validate(newPlayableRace);
      //
      //   // Check for errors in the validation
      //   if (error) {
      //     throw new AggregateValidationError(
      //       this._createErrorsArray(error),
      //       "Unable to validate the realm"
      //     );
      //   }

      // Attempt to save the new realm
      const result = await this.Repo.upsert(newPlayableRace);

      // Return the  result
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };
}

module.exports = PlayableRaceService;
