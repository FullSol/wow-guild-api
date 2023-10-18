const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;

// Import models
const { User, Profile, Character } = require("../models");

// import services
const {
  UserService,
  ProfileService,
  CharacterService,
} = require("../services");

// Instantiate the services
const userService = new UserService(User);
const profileService = new ProfileService(Profile);
const characterService = new CharacterService(Character);

const logger = require("../logger");

// Bnet Strategy
passport.use(
  new BnetStrategy(
    {
      clientID: process.env.BNET_CLIENT_ID,
      clientSecret: process.env.BNET_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/v1/users/auth/bnet/callback",
      passReqToCallback: true,
      scope: ["wow.profile"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("TRYing");
        // Pull the id from the session
        const { id } = req.session.user;

        // create user update DTO
        const updatedUserDTO = {
          id: id,
          bnetId: profile.id,
          bnetAccessToken: accessToken,
        };

        // Update the user
        await userService.update(updatedUserDTO);

        // Get the full user from the DB
        const user = await userService.readById(id);

        // Create a profile update DTO
        updatedProfileDTO = { userId: id, bnetHandle: profile.battletag };

        // Update the user's profile
        profileService.update(updatedProfileDTO);

        // Fetch user characters
        const bnetCharacters = await fetchUserCharacters(accessToken);

        // Create an array to hold multiple character DTOs
        const createCharacterDTOS = [];

        // Create a CharacterDTO for each bnetCharacter
        bnetCharacters.forEach((bnetCharacter) => {
          const createCharacterDTO = {
            userId: id,
            bnetId: bnetCharacter.id,
            name: bnetCharacter.name,
            realm: bnetCharacter.realm.name,
            playableClass: bnetCharacter.playable_class.name,
            playableRace: bnetCharacter.playable_race.name,
            gender: bnetCharacter.gender.name,
            faction: bnetCharacter.faction.name,
            level: bnetCharacter.level,
          };

          // Add to the createCharacterDTOS array
          createCharacterDTOS.push(createCharacterDTO);
        });

        // Start the asynchronous character creation operation
        const createCharacterPromises = createCharacterDTOS.map(
          (createCharacterDTO) => characterService.upsert(createCharacterDTO)
        );

        // Log any errors encountered
        Promise.allSettled(createCharacterPromises).catch((error) => {
          logger.info("Character creation errors");
          logger.error(error);
        });

        // Wrap up the passport strategy
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Function to fetch user characters from Battle.net API
async function fetchUserCharacters(accessToken) {
  try {
    // Region for Blizzard request
    const region = "us";

    // Make a request to the Battle.net API to get user characters
    const apiUrl = `https://${region}.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // convert to json object
    const data = await response.json();

    // Flatten the characters array and filter based on level
    const characters = data.wow_accounts
      .flatMap((account) => account.characters || [])
      .filter((character) => character.level >= 60);

    // Return the characters
    return characters;
  } catch (error) {
    throw new Error(`Error fetching user characters: ${error.message}`);
  }
}

module.exports = passport;
