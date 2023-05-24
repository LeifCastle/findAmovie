const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res) {
  return res.render("browse/browse");
});

module.exports = router;
