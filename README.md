# findAmovie

### Copying The Movie Database's Database

Downloaded their dailyID export file of every single movie's id plus a little other info to public/data/movie_ids_05_26_2023.json.gz, unzipDailyExports unzippes it to unzioppedDailyExports.json, processDailyExports.js parses the json line by line and moves each line (an object) but just the id and title into an array.

seedMovieBatch.js iterates through the the DailyExport array and requests the full movie details for each movieID from TMDB while following their request rate limiting (45 requests / 1 seconds). After 1,000 movies have been fetched, this batch is mapped to remove undesired entries, insert creating dates, and adjust some existing entires. This movie batch is then bulkInserted into the database, and a new movie batch begins. It takes approximately 20 seconds to process 1000 movies, or one batch, which at a total of 809,717 movies (movieIds.length) means it will take around 4hrs and 45 minutes to process all of TMDB's data.

Movie Model:
sequelize model:create --name movie --attributes imdb_id:integer,title:string,overview:string,adult:boolean,release_date:string,language:string,runtime:integer,status:string,budget:integer,revenue:integer,popularity:float,vote_average:float,vote_count:integer,genre_1:string,genre_2:string,genre_3:string,genre_4:string,genre_5:string,backdrop_path:string,poster_path:string,video_site:string,video_key:string,video_name:string

## WebDesign

### HomePage

The homepage begins the user's process of selecting a movie, they are given a choice to either take a questionaire first, or immedietly jump into filtering movies
![image info](./public/images/Home%20Page%20--%20Design%202.png)

### Questionaire Page

The user begins the questionaire, they have five questions and their answer determines the next question. Questions are housed in a card template aka a public html file (secuity issue?). A switch case based on choices generates an AJAX fetch request to get the appropriate template.
![image info](./public/images/Questionaire_Cards.png)
![image info](./public/images/Questionaire_Page.png)

The goal is to narrow down results to movies that match three or less genres within a certain time frame. The user can also obtain adult and animation filters.

How the ejs template class system work is the button's second class is how many total choices the user must make before progressing to the next page, and the button's parent div is how many choices the user must make in that specific div. Thus the only way to progress to the next page is to make every choice in every div

````<div class="pick2 2">
    <button id="m1A" class="choice 4"><%=m1A%></button>
  </div>```
````
