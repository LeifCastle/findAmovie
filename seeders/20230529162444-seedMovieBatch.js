"use strict";

require("dotenv").config();
const axios = require("axios");
const movieIds = require("../src/processedDailyExports.json");

const apiKey = TMDB_API_KEY;
const baseURL = "https://api.themoviedb.org/3/movie/";
const append = "append_to_response=videos,images";

let index = 511000;
let movieBatch = [];
let batchNumber = 1;
let parsedMovieBatch;
let errorLog = [];
let delayMet = false;

//Fetch movies at a rate of 45 movies per second
function fetchDelay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      delayMet = true;
      resolve();
    }, 23);
  });
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    while (index < movieIds.length) {
      //Fetch Movies
      while (movieBatch.length < 1000) {
        //await fetchDelay();
        const movie = await fetchMovieDetails(index);
        setTimeout(async () => {
          movieBatch.push(movie);
          console.log(`${index} - Movie Fetched: ${movieIds[index].title}`);
          index++;
          delayMet = false;
        }, 20);
      }
      //Parse Movies
      try {
        parsedMovieBatch = await parseMovieBatch(movieBatch);
        console.log(`Success-- Movie Batch: ${batchNumber} parsed`);
      } catch (error) {
        let errorMsg = `Parse Error-- Movie Batch: ${batchNumber} --- ${error}`;
        errorLog.push(errorMsg);
        console.log(errorLog);
      }
      //Insert Movies
      try {
        await queryInterface.bulkInsert("movies", parsedMovieBatch, {});
        console.log(`Success-- Movie Batch: ${batchNumber} inserted`);
      } catch (error) {
        let errorMsg = `Insertion Error-- Movie Batch: ${batchNumber} --- ${error}`;
        errorLog.push(errorMsg);
        console.log(errorLog);
      }
      movieBatch = [];
      batchNumber++;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies", null, {});
  },
};

//Makes an axios request to TMDB for a specific movie by it's id
async function fetchMovieDetails(index) {
  try {
    const response = await axios.get(
      `${baseURL}/${movieIds[index].id}?api_key=${apiKey}&${append}`
    );
    return response.data;
  } catch (error) {
    console.log(`Error fetching movie ID ${index}...${error}`);
  }
}

//Parses a movie batch by removing some entries and altering others
function parseMovieBatch(movieBatch) {
  return new Promise((resolve, reject) => {
    try {
      let result = movieBatch.map((movie) => {
        const {
          //Data entries to remove
          belongs_to_collection,
          homepage,
          original_title,
          original_language,
          production_companies,
          production_countries,
          tagline,
          video,
          //Data entries to modify
          genres,
          spoken_languages,
          videos,
          images,
          //Data entry kept as is
          ...rest
        } = movie;
        //Modified Entries
        rest["createdAt"] = new Date().toISOString();
        rest["updatedAt"] = new Date().toISOString();
        for (let i = 1; i < genres.length && i < 6; i++) {
          rest["genre_" + parseInt(i)] = genres[i].name;
        }
        if (spoken_languages.length > 0) {
          rest["language"] = spoken_languages[0].english_name;
        }
        for (let i = 1; i < videos.results.length; i++) {
          if (videos.results[i].type === "Trailer") {
            rest["video_site"] = videos.results[i].site;
            rest["video_key"] = videos.results[i].key;
            rest["video_name"] = videos.results[i].name;
            break;
          }
        }
        return rest;
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
