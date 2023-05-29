const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
const movieIds = require("./processedDailyExports.json");
const { json } = require("sequelize");

const apiKey = "f95c55e2a9a5625ec1d3b5c42e143840"; //process.env.TMDB_API_KEY;
const baseURL = "https://api.themoviedb.org/3/movie/";
const append = "append_to_response=videos,images";

let index = 0;
let movieBatch = [];
let batchNumber = 1;
let outputFile = "./allMoviesData.json";

let parsedMovieBatch;

//Create a file to write batches to (replace with database?)
fs.writeFile(outputFile, "", "utf8", (error) => {
  if (error) {
    console.log(`Error: ${error}`);
  } else {
    console.log(`${outputFile} succesfully created`);
  }
});

//Fetch movies at a rate of 45 movies per second
let fetchInterval = setInterval(async () => {
  const movie = await fetchMovieDetails(movieIds[index].id);
  movieBatch.push(movie);
  index++;
  console.log(`${index} - Movie Fetched: ${movieIds[index].title}`);
  if (index % 10000 === 0) {
    console.log("Batch Full");
    try {
      parsedMovieBatch = await parseMovieBatch(movieBatch);
    } catch (error) {
      console.log(`Error in movie batch: ${batchNumber} --- ${error}`);
      return;
    }
    let writeMovieBatch = await writeToDatabase(parsedMovieBatch);
    console.log(writeMovieBatch);
    movieBatch = [];
    batchNumber++;
  }
  if (index === movieIds.length) {
    clearInterval(fetchInterval);
  }
}, 23);

//Makes an axios request to TMDB for a specific movie by it's id
async function fetchMovieDetails(index) {
  try {
    const response = await axios.get(
      `${baseURL}/${movieIds[index].id}?api_key=${apiKey}&${append}`
    );
    return response.data;
  } catch (error) {
    console.log(`Error getting movie ID ${index}...${error}`);
  }
}

//Parses a movieBatch to have correct parameters before insertion into database
function parseMovieBatch(movieBatch) {
  return new Promise((resolve, reject) => {
    try {
      let result = movieBatch.map((movie) => {
        const {
          //Data entries to remove
          belongs_to_collection,
          homepage,
          original_title,
          production_companies,
          production_countries,
          tagline,
          video,
          //Data entries to modify
          genres,
          spoken_languages,
          videos,
          images,
          //Data entries kept as is
          ...rest
        } = movie;
        //Modify Data
        for (i = 1; i < genres.length; i++) {
          rest["genre_" + parseInt(i)] = genres[i].name;
        }
        if (spoken_languages.length > 0) {
          rest["language"] = spoken_languages[0].english_name;
        }
        //Only get one video, with that video's site, key, and name...the the first trailer sequentially
        for (i = 1; i < videos.results.length; i++) {
          if (videos.results[i].type === "Trailer") {
            rest["video_site"] = videos.results[i].site;
            rest["video_key"] = videos.results[i].key;
            rest["video_name"] = videos.results[i].name;
            break;
          }
        }
        //backdrops left out for now (images.backdrops[i].file_path)
        //Only one poster for now, the first one sequentially
        if (images.posters[0]) {
          rest["image_poster"] = images.posters[0].file_path;
        }
        return rest;
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

//Writes a movieBatch to a file (just need to change to a database)
function writeToDatabase(parsedMovieBatch) {
  return new Promise((resolve, reject) => {
    const JSONmovieBatch = JSON.stringify(parsedMovieBatch);
    fs.appendFile(outputFile, JSONmovieBatch, (error) => {
      if (error) {
        resolve(error);
      } else {
        resolve(`Success, check src/${outputFile} for your file`);
      }
    });
  });
}
