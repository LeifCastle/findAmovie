const express = require("express");
const router = express.Router();
const { user, movie, seenMovie } = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

let requestParams = {};
let filteredMovies;

router.get("/", (req, res) => {
  res.render("questionaire/questionaire");
});

router.post("/results", (req, res) => {
  requestParams = req.body;
  console.log(requestParams);
});

router.get("/results", async (req, res) => {
  //ensure genres has 3 entries for query
  while (requestParams.genres.length < 4) {
    requestParams.genres.push("");
  }
  filteredMovies = await getMovies();
  //console.log(filteredMovies.slice(1, 100));
  res.render("questionaire/results.ejs", {
    data: filteredMovies.slice(1, 100),
  });
});

router.put("/test", (req, res) => {
  if (!req.body.seen) {
    console.log("Unseen: " + req.body.title);
  } else if (req.body.seen) {
    console.log("Seen: " + req.body.title);
    // First, get a reference to a movie.
    seenMovie
      .findOrCreate({
        where: {
          movieId: req.body.id,
          title: req.body.title,
        },
      })
      .then(function ([seenMovie, created]) {
        // Second, get a reference to a user.
        user
          .findOne({
            where: { username: res.locals.currentUser.username },
          })
          .then(function (user) {
            // Finally, use the "addModel" method to attach one model to another model.
            seenMovie.addUser(user).then(function (relationInfo) {
              console.log(
                seenMovie.title,
                " added to ",
                user.username,
                "'s list of seen movies"
              );
            });
          });
      });
  }
});

// Create a Sequelize instance with database configuration
const sequelize = new Sequelize("moviesnag", "leif", "123", {
  host: "localhost",
  dialect: "postgres",
});

async function getMovies() {
  foundMovies = await movie.findAll({
    where: {
      [Op.or]: [
        { genre_1: requestParams.genres[0] },
        { genre_1: requestParams.genres[1] },
        { genre_1: requestParams.genres[2] },
        { genre_2: requestParams.genres[0] },
        { genre_2: requestParams.genres[1] },
        { genre_2: requestParams.genres[2] },
        { genre_3: requestParams.genres[0] },
        { genre_3: requestParams.genres[1] },
        { genre_3: requestParams.genres[2] },
      ],
      popularity: {
        [Op.gte]: 20, // Example condition for popularity >= 20
      },
      [Op.and]: [
        sequelize.literal(`release_date <> ''`), // Exclude empty strings
        sequelize.literal(`release_date IS NOT NULL`), // Exclude null values
        sequelize.literal(
          `CAST(SUBSTRING(release_date, 1, 4) AS INTEGER) > (2023-${requestParams.years})`
        ), // Year condition
        sequelize.literal(
          `CASE WHEN ${requestParams.animation} THEN genre_1 = 'Animation' ELSE TRUE END`
        ),
        sequelize.literal(
          `CASE WHEN ${!requestParams.animation} THEN genre_1 != 'Animation' ELSE TRUE END`
        ), //Animation condition
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
