"use strict";

const BaseService = require("./baseService");
const { AuthorizationCode } = require("simple-oauth2");

class GuildService extends BaseService {
  constructor(repo, oAuthClient) {
    super(repo);
    this.oAuthClient = oAuthClient;
  }

  create = async (guildDTO) => {
    try {
      // Validate the incoming data

      // Check for errors in the validation

      const { realm, guildName } = guildDTO;

      const apiUrl = `https://us.api.blizzard.com`;
      const apiUri = `/data/wow/guild/${realm}/${guildName}`;
      const namespace = `profile-us`;
      const locale = `en_US`;
      const access_token = `${apiKey}`;
      const requestUri =
        apiUrl + apiUri + "?" + namespace + "&" + locale + "&" + access_token;

      // Attempt to pull the information from the Blizzard API
      const response = fetch(requestUri)
        .then((response) => response.json())
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error("Error fetching guild information:", error);
        });

      // Check the results
      console.log(response);

      // Create DTO from blizzard Data
      const bnetGuildDTO = {};

      // Attempt to insert the new guild into DB
      const result = await this.Repo.create(bnetGuildDTO);

      // Return the results
      return result;
    } catch (error) {
      this._handleServiceError(this.constructor.name, "create", error);
    }
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
}

module.exports = GuildService;
