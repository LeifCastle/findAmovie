//*** This file unzips the daily Id Export file from The Movie Databse ***/
const fs = require("fs");
const zlib = require("zlib");

const inputFilePath = "../public/data/movie_ids_05_26_2023.json.gz";
const outputFilePath = "../public/data/unzippedDailyExport.json";

const inputStream = fs.createReadStream(inputFilePath);
const outputStream = fs.createWriteStream(outputFilePath);

const unzipStream = inputStream.pipe(zlib.createGunzip());

unzipStream.on("error", (error) => {
  console.error("Error unzipping file:", error);
});

unzipStream
  .pipe(outputStream)
  .on("error", (error) => {
    console.error("Error writing unzipped data to file:", error);
  })
  .on("finish", () => {
    console.log("Unzipping completed.");
  });
