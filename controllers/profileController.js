"use strict";

const logger = require("../logger");

module.exports = (service) => {
  return {
    getUserProfile: async (req, res) => {
      try {
        const profile = await service.readOneByUser(req.params.userId);

        res.status(200).json(profile);
      } catch (error) {
        logger.error(error.message);
        throw error;
      }
    },

    updateUserProfile: async (req, res) => {
      try {
        const { userId } = req.params;
        const result = await service.update(userId, req.body);
        res.status(200).send("User profile successfully updated.");
      } catch (error) {
        logger.error(error.message);
        throw error;
      }
    },
  };
};
