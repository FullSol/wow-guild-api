const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
const { User, Profile } = require("../models");

// Bnet Strategy
passport.use(
  new BnetStrategy(
    {
      clientID: process.env.BNET_CLIENT_ID,
      clientSecret: process.env.BNET_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/bnet/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Pull the id from the session
        const { id } = req.session.user;

        // Update the user's information
        await User.update(
          { bnetId: profile.id, bnetAccessToken: accessToken },
          { where: { id: id } }
        );

        // Get the full user from the DB
        const user = await User.findByPk(id);

        // Update the user's profile
        await Profile.update(
          { bnetHandle: profile.battletag },
          { where: { userId: user.id } }
        );

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

module.exports = passport;
