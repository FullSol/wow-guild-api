"use strict";

const BaseService = require("./baseService");
const {
  CharacterCreateSchema: createSchema,
  CharacterUpdateSchema: updateSchema,
} = require("../validations");

const { AggregateValidationError } = require("../errors/custom");

class CharacterService extends BaseService {
  constructor(repo) {
    super(repo, createSchema, updateSchema);
  }

  readAllUserCharacters = async (userId) => {
    try {
      // Attempt to retrieve information from the DB
      const result = await this.Repo.findAll({ where: { userId: userId } });

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "readAll", error);
    }
  };

  upsert = async (newCharacter) => {
    try {
      // Validate the new character
      const { error } = this.createSchema.validate(newCharacter);

      // Check for errors in the validation
      if (error) {
        throw new AggregateValidationError(
          this._createErrorsArray(error),
          "Unable to validate the character"
        );
      }

      // Attempt to save the new character
      const result = await this.Repo.upsert(newCharacter);

      // Return the  result
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
  };
}

module.exports = CharacterService;
