//------Setup
//Requirements
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");
const bodyParser = require("body-parser");

//Express Setup
const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // for parsing URL-encoded data
app.use(bodyParser.json()); // for parsing JSON data

//------Routes
//Home
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.use("/questionaire", require("./controllers/questionaire.js"));
app.use("/snagEngine", require("./controllers/snagEngine.js"));

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
