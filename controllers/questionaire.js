const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("questionaire/questionaire");
});

router.get("/results", (req, res) => {
  res.render("questionaire/results.ejs");
});

router.post("/", (req, res) => {
  res.render("questionaire/results.ejs", response.data);
});

module.exports = router;
