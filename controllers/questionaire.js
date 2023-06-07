const express = require("express");
const router = express.Router();
const { movie } = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

let data = {};
let parsedParams = {};
let requestParams = {};
let filteredMovies;
router.get("/", (req, res) => {
  res.render("questionaire/questionaire");
});

router.post("/results", (req, res) => {
  requestParams = req.body;
});

router.get("/results", async (req, res) => {
  await parseData();
  filteredMovies = await getMovies();
  //console.log(filteredMovies.slice(1, 100));
  res.render("questionaire/results.ejs", {
    data: filteredMovies.slice(1, 100),
  });
});

async function parseData() {
  //console.log(requestParams.genres.length);
  parsedParams = {
    genres: [],
    years: requestParams.years,
    animation: requestParams.animation,
  };
  for (i = 0; i < requestParams.genres.length; i++) {
    let item = requestParams.genres[i];
    let [firstLetter, ...rest] = item.split("");
    let itemArray = firstLetter.toUpperCase() + rest.join("").toLowerCase();
    parsedParams.genres.push(itemArray);
  }
  console.log(parsedParams);
  //ensure parsedData has 3 entries for query
  while (parsedParams.length < 3) {
    parsedParams.push("");
  }
}

// Create a Sequelize instance with your database configuration
const sequelize = new Sequelize("moviesnag", "leif", "123", {
  host: "localhost",
  dialect: "postgres", // or any other supported dialect
});

// Define your model and perform operations with Sequelize

// Example query using sequelize.literal
async function getMovies() {
  foundMovies = await movie.findAll({
    where: {
      [Op.or]: [
        { genre_1: parsedParams.genres[0] },
        { genre_1: parsedParams.genres[1] },
        { genre_1: parsedParams.genres[2] },
        { genre_2: parsedParams.genres[0] },
        { genre_2: parsedParams.genres[1] },
        { genre_2: parsedParams.genres[2] },
        { genre_3: parsedParams.genres[0] },
        { genre_3: parsedParams.genres[1] },
        { genre_3: parsedParams.genres[2] },
      ],
      popularity: {
        [Op.gte]: 20, // Example condition for popularity >= 20
      },
      [Op.and]: [
        sequelize.literal(`release_date <> ''`), // Exclude empty strings
        sequelize.literal(`release_date IS NOT NULL`), // Exclude null values
        sequelize.literal(
          `CAST(SUBSTRING(release_date, 1, 4) AS INTEGER) > (2023-${parsedParams.years})`
        ), // Year condition
      ],
      [Op.and]: [
        sequelize.literal(
          `CASE WHEN ${parsedParams.animation} THEN genre_1 = 'Animation' ELSE TRUE END`
        ),
        sequelize.literal(
          `CASE WHEN ${!parsedParams.animation} THEN genre_1 != 'Animation' ELSE TRUE END`
        ),
      ],
    },
    order: [["popularity", "DESC"]],
  });
  return foundMovies;
}

router.get("/:input", function (req, res) {
  res.render("404", { badLink: req.params.input });
});

module.exports = router;

// `SELECT title FROM movies
//           WHERE release_date <> '' -- Exclude empty strings
//             AND release_date IS NOT NULL -- Exclude null values
//             AND CAST(SUBSTRING(release_date, 1, 4) AS INTEGER) < 1990;`
