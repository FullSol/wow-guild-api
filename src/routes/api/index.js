"use strict";

const express = require("express");
const userApiRoutes = require("./userRoutes");
const profileApiRoutes = require("./profileRoutes");
const characterApiRoutes = require("./characterRoutes");
const guildApiRoutes = require("./guildRoutes");

const router = express.Router();

// Import the models
const {
  User,
  Profile,
  Character,
  Guild,
  PlayableRace,
  PlayableClass,
  Realm,
} = require("../../models");

// Import the services
const {
  UserService,
  ProfileService,
  CharacterService,
  GuildService,
  OAuthClient,
  BnetService,
  PlayableRaceService,
  PlayableClassService,
  RealmService,
} = require("../../services");

module.exports = (passport) => {
  // oAuthClient
  const oAuthClient = new OAuthClient();

  // Inject models into the services
  const userService = new UserService(User);
  const profileService = new ProfileService(Profile);
  const characterService = new CharacterService(Character);
  const guildService = new GuildService(Guild, oAuthClient);
  const playableRaceService = new PlayableRaceService(PlayableRace);
  const playableClassService = new PlayableClassService(PlayableClass);
  const realmService = new RealmService(Realm);
  const bnetService = new BnetService(
    playableClassService,
    playableRaceService,
    realmService,
    characterService
  );

  // Import the controllers
  const {
    UserController,
    ProfileController,
    CharacterController,
    GuildController,
  } = require("../../controllers/");

  // Inject services into the controllers
  const userController = new UserController(userService, bnetService);
  const profileController = new ProfileController(profileService);
  const characterController = new CharacterController(characterService);
  const guildController = new GuildController(guildService);

  router.use("/users", userApiRoutes(userController, passport));
  router.use("/profiles", profileApiRoutes(profileController));
  router.use("/characters", characterApiRoutes(characterController));
  router.use("/guilds", guildApiRoutes(guildController));

  return router;
};
