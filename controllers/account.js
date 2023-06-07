const express = require("express");
const router = express.Router();
const passport = require("../config/ppConfig");
const { user } = require("../models");

router.get("/login", function (req, res) {
  res.render("account/login.ejs");
});

router.get("/create", function (req, res) {
  res.render("account/create.ejs");
});

router.post("/create", async function (req, res) {
  const { firstName, lastName, username, password } = req.body;
  try {
    const [_user, created] = await user.findOrCreate({
      where: { username },
      defaults: { firstName, lastName, password },
    });

    if (created) {
      // if created, success and we will redirect back to / page
      console.log(`----- ${_user.username} was created -----`);
      const successObject = {
        successRedirect: "/",
        successFlash: `Welcome ${_user.username}. Account was created and logging in...`,
      };
      //
      passport.authenticate("local", successObject)(req, res);
    } else {
      // Send back email already exists
      req.flash("error", "Email already exists");
      res.redirect("/account/create"); // redirect the user back to sign up page to try again
    }
  } catch (error) {
    // There was an error that came back; therefore, we just have the user try again
    console.log("**************Error");
    console.log(error);
    req.flash(
      "error",
      "Either email or password is incorrect. Please try again."
    );
    res.redirect("/account/create");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/login",
    successFlash: "Welcome back ...",
    failureFlash: "Either email or password is incorrect",
  })
);

router.get("/:input", function (req, res) {
  res.render("404", { badLink: req.params.input });
});

module.exports = router;
