//------Setup
//Requirements
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");

//Express Setup
const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//------Routes
//Home
app.get("/", function (req, res) {
  res.render("index.ejs");
});
app.use("/filters", require("./controllers/filters"));
app.use("/survey", require("./controllers/survey.js"));
app.use("/browse", require("./controllers/browse.js"));

//------Setup
//Server
const PORT = process.env.PORT || 8000;
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
