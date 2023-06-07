const express = require("express");
const router = express.Router();
const { user, movie, usersSeenMovies } = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

let requestParams = {};

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
  let seenMovieArray = [];
  async function getSeenMovies() {
    //If the user is logged in get the movies they've seen
    if (res.locals.currentUser) {
      const thisUser = await user.findOne({
        where: { username: res.locals.currentUser.username },
      });
      const movies = await thisUser.getMovies();
      movies.forEach((movie) => {
        seenMovieArray.push(movie.title);
      });
    }
  }
  await getSeenMovies();
  const filteredMovies = await getMovies(seenMovieArray);
  //console.log(filteredMovies.slice(1, 100));
  res.render("questionaire/results.ejs", {
    data: filteredMovies.slice(1, 100),
  });
});

router.put("/test", (req, res) => {
  if (!req.body.seen) {
    console.log("Unseen: " + req.body.title);
    user
      .findOne({
        where: { username: res.locals.currentUser.username },
      })
      .then((user) => {
        usersSeenMovies
          .destroy({
            where: {
              movieId: req.body.id,
              userId: user.id,
            },
          })
          .then((numRowsDeleted) => {
            console.log(
              numRowsDeleted,
              `seen movie deleted: ${req.body.title}`
            );
          });
      });
  } else if (req.body.seen) {
    console.log("Seen: " + req.body.title);
    // First, get a reference to a movie.
    user
      .findOne({
        where: { username: res.locals.currentUser.username },
      })
      .then(function (user) {
        // Second, get a reference to a user.
        movie
          .findOne({
            where: {
              id: parseInt(req.body.id),
            },
          })
          .then(function (movie) {
            // Finally, use the "addModel" method to attach one model to another model.
            user.addMovie(movie).then(function (relationInfo) {
              console.log(
                movie.title,
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

async function getMovies(seenMovieArray) {
  foundMovies = await movie.findAll({
    where: {
      popularity: {
        [Op.gte]: 20, // Example condition for popularity >= 20
      },
      [Op.or]: [
        sequelize.literal(
          requestParams.genres[0]
            ? `genre_1 IN ('${requestParams.genres.join("','")}')`
            : "TRUE"
        ), //Genre_1 condition
        sequelize.literal(
          requestParams.genres[0]
            ? `genre_2 IN ('${requestParams.genres.join("','")}')`
            : "TRUE"
        ), //Genre_2 condition
        sequelize.literal(
          requestParams.genres[0]
            ? `genre_3 IN ('${requestParams.genres.join("','")}')`
            : "TRUE"
        ), //Genre_3 condition
        sequelize.literal(
          requestParams.genres[0]
            ? `genre_4 IN ('${requestParams.genres.join("','")}')`
            : "TRUE"
        ), //Genre_4 condition
        sequelize.literal(
          requestParams.genres[0]
            ? `genre_5 IN ('${requestParams.genres.join("','")}')`
            : "TRUE"
        ), //Genre_5 condition
      ],
      [Op.and]: [
        sequelize.literal(`release_date <> ''`), // Exclude empty strings
        sequelize.literal(`release_date IS NOT NULL`), // Exclude null values
        sequelize.literal(
          `CAST(SUBSTRING(release_date, 1, 4) AS INTEGER) > (2023-${requestParams.years})`
        ), // Year condition
        sequelize.literal(
          `CASE WHEN ${requestParams.animation} THEN genre_1 = 'Animation' ELSE TRUE END`
        ), //Animation condition
        sequelize.literal(
          `CASE WHEN ${!requestParams.animation} THEN genre_1 != 'Animation' ELSE TRUE END`
        ), //Animation condition
        sequelize.where(
          sequelize.literal(
            seenMovieArray.length > 0
              ? `title NOT IN ('${seenMovieArray.join("','")}')`
              : "TRUE"
          ),
          true
        ), //Seen Movies condition
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
