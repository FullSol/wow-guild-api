"use strict";

const logger = require("../logger");
const BaseController = require("./baseController");

class ProfileController extends BaseController {
  constructor(service) {
    super(service);
  }
  async getProfile(req, res) {
    try {
      const profile = await this.service.readOneByUser(req.params.userId);
      res.status(200).json(profile);
    } catch (error) {
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      if (userId === null) throw new Error("invalid ID request");
      await this.service.update(userId, req.body);
      res.status(200).send("User profile successfully updated.");
    } catch (error) {
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }
}

module.exports = ProfileController;
