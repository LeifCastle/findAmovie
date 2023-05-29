const fs = require("fs");
const { resolve } = require("path");

const importFilePath = "../public/data/unzippedDailyExport.json";
const exportFilePath = "processedDailyExports.json";

let movies = [];
let lineIndex = 1;

const jsonData = fs.readFileSync(importFilePath, "utf-8");

fs.writeFile(exportFilePath, "", "utf8", (error) => {
  if (error) {
    console.log(`Error: ${error}`);
  } else {
    console.log(`${exportFilePath} succesfully created`);
  }
});

function processDailyExports() {
  return new Promise((resolve, reject) => {
    try {
      const lines = jsonData.split("\n");
      for (const line of lines) {
        let parsedLine = JSON.parse(line);
        movies.push({ id: parsedLine.id, title: parsedLine.original_title });
        lineIndex++;
      }
      resolve(movies);
    } catch (error) {
      console.log(`Error on line ${lineIndex}...${error}`);
      resolve(movies);
    }
  });
}

async function run() {
  let processedMovies = await processDailyExports();
  let JSONprocessedMovies = JSON.stringify(processedMovies);
  fs.appendFile(exportFilePath, JSONprocessedMovies, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Success: ${exportFilePath} populated`);
    }
  });
}

run();
