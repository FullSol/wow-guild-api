"use strict";

const BaseService = require("./baseService");

class RealmService extends BaseService {
  constructor(service) {
    super(service);
  }

  upsert = async (newRealm) => {
    try {
      // Validate the new realm
      //   const { error } = this.createSchema.validate(newRealm);
      //
      // Check for errors in the validation
      //   if (error) {
      //     throw new AggregateValidationError(
      //       this._createErrorsArray(error),
      //       "Unable to validate the realm"
      //     );
      //   }

      // Attempt to save the new realm
      const result = await this.Repo.upsert(newRealm);

      // Return the  result
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };
}

module.exports = RealmService;
