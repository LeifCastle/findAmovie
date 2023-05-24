const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res) {
  return res.render("survey/survey");
});

module.exports = router;
