const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
class bnetService {
  constructor() {
    // Configure Passport to use BnetStrategy
    passport.use(
      new BnetStrategy(
        {
          clientID: process.env.BNET_ID,
          clientSecret: process.env.BNET_SECRET,
          callbackURL: "http://localhost:3001/users/auth/bnet/callback", // Update the URL accordingly
          region: "us",
        },
        function (accessToken, refreshToken, profile, done) {
          // You can customize how user information is handled here
          return done(null, profile);
        }
      )
    );
  }

  authenticate = (req, res) => {
    // Redirect the user to Blizzard for authentication
    return passport.authenticate("bnet")(req, res);
  };

  connectBnet = (userId, bnetAccessToken) => {};

  disconnectBnet = (userId) => {};
}

module.exports = bnetService;
