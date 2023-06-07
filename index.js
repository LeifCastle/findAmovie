//------Setup
//Requirements
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");
const bodyParser = require("body-parser");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/ppConfig");
const isLoggedIn = require("./middleware/isLoggedIn");
const app = express();

SECRET_SESSION = process.env.SECRET_SESSION;
console.log(">>>>>>>>>>>>>>>>", SECRET_SESSION);

//Express Setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // for parsing URL-encoded data
app.use(bodyParser.json()); // for parsing JSON data

app.use(flash()); // flash middleware

app.use(
  session({
    secret: SECRET_SESSION, // What we actually will be giving the user on our site as a session cookie
    resave: false, // Save the session even if it's modified, make this false
    saveUninitialized: true, // If we have a new session, we save it, therefore making that true
  })
);

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

//------Routes

//Home
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.use("/questionaire", require("./controllers/questionaire.js"));
app.use("/snagEngine", require("./controllers/snagEngine.js"));
app.use("/account", require("./controllers/account.js"));

app.get("/profile", isLoggedIn, (req, res) => {
  const { id, username, email } = req.user.get();
  res.render("profile", { id, username, email });
});

app.get("/:input", function (req, res) {
  res.render("404", { badLink: req.params.input });
});

//------Setup
//Server
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`MovieSnag is runniong on port ${PORT}`);
});
//Exports
module.exports = {
  server,
  app,
  PORT,
  axios,
};
