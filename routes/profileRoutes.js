"use strict";

const express = require("express");
const router = express.Router();

// Import the Profile model
const { Profile } = require("../models");

// Import the profileService
const { ProfileService } = require("../services");
const profileService = new ProfileService(Profile);

// Import the profileController
const { profileController } = require("../controllers/")(profileService);

router.get("/:userId", profileController.getUserProfile);
router.patch("/:userId", profileController.updateUserProfile);

module.exports = router;
