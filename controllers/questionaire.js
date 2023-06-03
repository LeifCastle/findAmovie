const express = require("express");
const router = express.Router();

let card = "Audience";

router.get("/", function (req, res) {
  res.render("questionaire/questionaire");
});

module.exports = router;
