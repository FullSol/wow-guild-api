"use strict";

const BaseController = require("./baseController");
const { ProfileDTO, UpdateProfileDTO } = require("../dtos/profile");

class ProfileController extends BaseController {
  constructor(service) {
    super(service);
  }
  async getProfile(req, res) {
    try {
      // Pull the userId from the req.params
      const { userId } = req.params;

      // Attempt to retrieve the profile
      const result = await this.service.read(userId);

      // Create DTO to send back to the client
      const profile = new ProfileDTO(
        result.id,
        result.userId,
        result.about,
        result.bnetHandle,
        result.twitterHandle,
        result.facebookHandle,
        result.discordHandle,
        result.youtubeHandle,
        result.createdAt,
        result.updatedAt
      );

      // Send response
      res.status(200).json(profile);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "getProfile",
        error
      );
    }
  }

  async updateProfile(req, res) {
    try {
      // Pull the userId from the session
      const { id } = req.session.user;

      // Check if the ID is somehow not set
      if (id === null) throw new Error("Please sign in");

      // Pull the expected fields from the body
      const {
        about,
        bnetHandle,
        twitterHandle,
        facebookHandle,
        discordHandle,
        youtubeHandle,
      } = req.body;

      // Create an updateProfileDTO
      const updateProfileDTO = new UpdateProfileDTO(
        id,
        about,
        bnetHandle,
        twitterHandle,
        facebookHandle,
        discordHandle,
        youtubeHandle
      );

      // Attempt to update the profile
      await this.service.update(updateProfileDTO);

      // Send successful response to the client
      res.status(200).send("User profile successfully updated.");
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "updateProfile",
        error
      );
    }
  }
}

module.exports = ProfileController;
