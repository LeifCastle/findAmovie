# findAmovie

### Copying The Movie Database's Database

Downloaded their dailyID export file of every single movie's id plus a little other info to public/data/movie_ids_05_26_2023.json.gz, unzipDailyExports unzippes it to unzioppedDailyExports.json, processDailyExports.js parses the json line by line and moves each line (an object) but just the id and title into an array.

copyTMDB_test.js takes a small test sample of the full data that iterates through the array and requests the full movie details for each movieID from TMDB while following their request rate limiting (45 requests / 1 seconds). Each movie request parses the return value to remove undesired data if neccesary. The data is then pushed to a movies array which is written in JSON format to the file allMovieData.json It takes approximately 20 seconds to process 1000 movies, which at a total of 809,717 movies (movieIds.length) means it will take around 4hrs and 45 minutes to process all of TMDB's data.

allMovieData.json's movie array is then seeded into my database and I will have all the data TMDB does at my fingertips. Note the data is concurrent with what they have on 5/27, i would need to come up with a way to run this every so often if I wanted to keep the data up to date.
