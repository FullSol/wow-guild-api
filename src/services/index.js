const UserService = require("./userService");
const ProfileService = require("./profileService");
const CharacterService = require("./characterService");
const GuildService = require("./guildService");
const OAuthClient = require("./oAuthService");
const PlayableRaceService = require("./playableRaceService");
const PlayableClassService = require("./playableClassService");
const RealmService = require("./realmService");
const BnetService = require("./bnetService");

module.exports = {
  UserService,
  BnetService,
  ProfileService,
  CharacterService,
  GuildService,
  OAuthClient,
  PlayableRaceService,
  PlayableClassService,
  RealmService,
};
