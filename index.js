//------Setup
//Requirements
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");
//Express Setup
const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);

//------Routes
//Home
app.get("/", function (req, res) {
  res.render("index.ejs");
});
//Filter
app.use("/filter", require("./controllers/filter"));

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
