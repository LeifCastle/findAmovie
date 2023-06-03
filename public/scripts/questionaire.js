document.addEventListener("DOMContentLoaded", () => {
  //-----Global Variables
  let progress = 1;
  let cardHistory = ["Audience"];
  let genres = {
    action: "Action",
    adventure: "Adventure",
    animation: "Animation",
    comedy: "Comedy",
    crime: "Crime",
    documentary: "Documentary",
    drama: "Drama",
    family: "Family",
    fantasy: "Fantasy",
    history: "History",
    horror: "Horror",
    music: "Music",
    mystery: "Mystery",
    romance: "Romance",
    scifi: "Science Fiction",
    thriller: "Thriller",
    tvMovies: "TV Movie",
    war: "War",
    western: "Western",
  };
  let tempGenres = {};
  let tempMGenres = {};
  let keep = [];

  //-----Query Selectors
  let back = document.querySelector("#back");
  let card = document.querySelector("#cardParent");
  let questionTitle = document.querySelector("#questionTitle");
  let selections = 0;
  let selectionReq = 0;

  //-----Event Listeners
  $(document).on("click", ".choice", (event) => {
    selectionReq = parseInt(event.target.classList[1]);
    let picked = parseInt(event.target.parentNode.classList[1]);
    selections++; //Total selections on card
    picked--; //An individual div's required selection count left
    //--Update the div's required selection count left
    event.target.parentNode.classList.remove(
      event.target.parentNode.classList[1]
    );
    event.target.parentNode.classList.add(picked.toString());
    //--If picked elment's parent div has met its required selection count
    if (picked === 0) {
      let elements = event.target.parentNode.querySelectorAll("*");
      elements.forEach((element) => {
        element.setAttribute("disabled", "disabled");
      });
    }
    let idArray = event.target.id.split("");
    let [alter, ...id] = idArray;
    //Run the results of a specific selection choice
    runChoice(alter, id.join("").toLowerCase());
    //If all required selections are made go to next card
    if (selections === selectionReq) {
      progress++;
      checkProgress();
      runCard(
        event.target.parentNode.parentNode.classList[0],
        id.join("").toLowerCase()
      );
    }
  });
  //--Back Button
  back.addEventListener("click", () => {
    cardHistory.pop();
    updateCard(cardHistory[cardHistory.length - 1]);
    //removies the cardHistory pushed by the function
    cardHistory.pop();
    progress--;
    checkProgress();
  });

  //------Card Choice Logic
  function runCard(currentCard, choice) {
    console.log(currentCard + " " + choice);
    switch (currentCard) {
      case "audience":
        switch (choice) {
          case "me":
          case "friends":
            updateCard("GenreChoice");
            break;
          case "couples":
            updateCard("romance");
            break;
          case "family":
            updateCard("Maturity");
            break;
        }
        break;
      case "genreChoice":
        updateCard("ReleaseYears");
        break;
      case "romance":
        switch (choice) {
          case "justromance":
            updateCard("romancePairing");
            break;
          default:
            updateCard("ReleaseYears");
            break;
        }
    }
  }
  //-----Selection Choice Logic
  function runChoice(alter, choice) {
    switch (alter) {
      case "r":
        delete genres[choice];
        break;
      case "a":
        keep.push(choice);
        if (keep.length > 1) {
          for (let z = 5; z < 9; z++) {
            if (
              tempGenres[`Genre${z}`] != keep[0] &&
              tempGenres[`Genre${z}`] != keep[1]
            ) {
              //need to update to include history for back button
              delete genres[tempGenres[`Genre${z}`]];
            }
          }
        }
        break;
      default:
    }
  }

  //-----Card Rendering
  function updateCard(choice) {
    selections = 0; //reset multiple choice selection count
    cardHistory.push(choice.toLowerCase()); //Update card history
    let route = `./cards/${choice.toLowerCase()}.ejs`;
    fetch(route)
      .then(function (response) {
        return response.text();
      })
      .then(function (template) {
        genreResolve(choice);
        let renderedHTML = ejs.render(template, tempGenres);
        card.innerHTML = renderedHTML;
        questionTitle.textContent = choice;
      })
      .catch(function (err) {
        console.log("Failed to fetch page: ", err);
      });
  }

  //update to have certain parameters such as always include certain ones like sci-fi or action in good pick
  function genreResolve(choice) {
    console.log("i Ran");
    let genreKeys = Object.keys(genres);
    let romanceKeys = [
      "mystery",
      "comedy",
      "drama",
      "action",
      "thriller",
      "horror",
    ];
    switch (choice) {
      case "GenreChoice":
        for (let i = 1; i < 10; i++) {
          let randomIndex = Math.floor(Math.random() * genreKeys.length);
          let randomGenre = genreKeys[randomIndex];
          genreKeys.splice(randomIndex, 1);
          tempGenres[`Genre${i}`] = randomGenre;
        }
        break;
      case "romance":
        for (let i = 1; i < 5; i++) {
          let randomIndex = Math.floor(Math.random() * romanceKeys.length);
          let randomGenre = romanceKeys[randomIndex];
          romanceKeys.splice(randomIndex, 1);
          tempGenres[`Genre${i}`] = randomGenre;
        }
        break;
    }
  }

  //--Check to see if back button should be displayed
  function checkProgress() {
    if (progress === 1) {
      back.setAttribute("hidden", "hidden");
    } else {
      back.removeAttribute("hidden");
    }
  }
});
