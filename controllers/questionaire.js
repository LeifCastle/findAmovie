const express = require("express");
const router = express.Router();
const { movie } = require("../models");

let data = {};
let parsedData = [];
let filteredMovies;
router.get("/", (req, res) => {
  res.render("questionaire/questionaire");
});

router.post("/results", (req, res) => {
  data = req.body;
});

router.get("/results", async (req, res) => {
  await parseData();
  filteredMovies = await getMovies();
  console.log(filteredMovies);
  res.render("questionaire/results.ejs", { data: filteredMovies });
});

async function parseData() {
  parsedData = [];
  data.forEach((item) => {
    let [firstLetter, ...rest] = item.split("");
    let itemArray = firstLetter.toUpperCase() + rest.join("").toLowerCase();
    parsedData.push(itemArray);
  });
}

async function getMovies() {
  let foundMovies;
  try {
    foundMovies = await movie.findOne({
      where: { genre_1: parsedData[0] },
    });
  } catch (error) {
    console.error("Error searching for user:", error);
  }
  return foundMovies.dataValues;
}

module.exports = router;
