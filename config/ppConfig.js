const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Database
const { user } = require("../models");

const STRATEGY = new LocalStrategy(
  {
    usernameField: "username", // looks for an email field as the username
    passwordField: "password",
  },
  async (username, password, cb) => {
    try {
      const foundUser = await user.findOne({
        where: { username },
      });

      if (!foundUser || !foundUser.validPassword(password)) {
        cb(null, false); // if no user or invalid password, return false
      } else {
        cb(null, foundUser);
      }
    } catch (err) {
      console.log("------- Error below -----------");
      console.log(err);
    }
  }
);

// Passport "serialize" info to be able to login
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const foundUser = await user.findByPk(id);

    if (foundUser) {
      cb(null, foundUser);
    }
  } catch (err) {
    console.log("---- Yo... There is an error ----");
    console.log(err);
  }
});

passport.use(STRATEGY);

module.exports = passport;
