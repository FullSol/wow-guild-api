"use strict";

const express = require("express");
const router = express.Router();

// Import the Profile model
const { Profile } = require("../../models");

// Import the profileService
const { ProfileService } = require("../../services");

//Inject the model into the service
const profileService = new ProfileService(Profile);

// Import the profileController and inject the service
const { profileController } = require("../../controllers/")(profileService);

// Route for retrieving profile information by userId
router.get("/:userId", profileController.getUserProfile);

// Route for updating profile information by userId
router.patch("/:userId", profileController.updateUserProfile);

module.exports = router;
