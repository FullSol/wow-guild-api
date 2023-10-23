"use strict";

const passport = require("passport");
const BnetStrategy = require("passport-bnet").Strategy;
const { User, Profile } = require("../models");
const { UserService, ProfileService } = require("../services");
const userService = new UserService(User);
const profileService = new ProfileService(Profile);

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
      // Get the current user id from the session.
      const { id } = req.session.user;

      // Create new DTO wih bnetId and access token
      const updatedUserDTO = {
        id: id,
        bnetId: profile.id,
        bnetAccessToken: accessToken,
      };

      // Update the user
      await userService.update(updatedUserDTO);

      // Pull the full user from the DB
      const user = await userService.readById(id);

      // Create profileUpdateDTO
      const profileUpdateDTO = {
        userId: id,
        bnetHandle: profile.battletag,
      };

      // Update the profile - do not need to wait for this
      profileService.update(profileUpdateDTO);

      return done(null, user);
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
