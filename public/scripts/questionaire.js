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
    //documentary: "Documentary",
    drama: "Drama",
    family: "Family",
    fantasy: "Fantasy",
    history: "History",
    horror: "Horror",
    //music: "Music",
    mystery: "Mystery",
    romance: "Romance",
    scifi: "Science Fiction",
    thriller: "Thriller",
    tvMovies: "TV Movie",
    war: "War",
    western: "Western",
  };
  let animationBool = false;
  let tempGenres = {};
  let keep = [];
  let finalGenres = [];
  let mainPath = true;
  let cardCount = 0;

  let releaseYear = 10;

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

  $(document).on("input", ".range", (event) => {
    var valueText = document.querySelector(".value-text");
    valueText.textContent = event.currentTarget.value;
    releaseYear = event.currentTarget.value;
  });

  $(document).on("click", ".done", (event) => {
    runCard(event.target.id);
  });

  //------Card Choice Logic
  function runCard(currentCard, choice) {
    //console.log(currentCard + " " + choice);
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
        //console.log("keep: " + keep);
        for (let z = 5; z < 9; z++) {
          if (
            (keep[0] ? tempGenres[`Genre${z}`] != keep[0] : true) &&
            (keep[1] ? tempGenres[`Genre${z}`] != keep[1] : true) &&
            (keep[2] ? tempGenres[`Genre${z}`] != keep[2] : true) &&
            (keep[3] ? tempGenres[`Genre${z}`] != keep[3] : true)
          ) {
            //need to update to include history for back button
            delete genres[tempGenres[`Genre${z}`].toLowerCase()];
          }
        }
        cardCount++;
        if (cardCount === 1) {
          updateCard("ReleaseYears");
        } else {
          updateCard("finalThree");
        }
        break;
      case "romancePreferences":
        switch (choice) {
          case "justromance":
            updateCard("romancePairing");
            mainPath = false;
            break;
          default:
            updateCard("GenreChoice");
            break;
        }
        break;
      case "romancePairing":
        updateCard("animation");
        break;
      case "releaseYears":
        if (mainPath) {
          updateCard("GenreChoice");
        } else {
          finishQuestionaire();
        }

        break;
      case "animation":
        updateCard("ReleaseYears");
        break;
      case "finalThree":
        finishQuestionaire();
    }
  }
  //-----Selection Choice Logic
  function runChoice(alter, choice) {
    switch (alter) {
      case "r":
        delete genres[choice];
        break;
      case "m":
        delete genres[choice];
        finalGenres.push(choice);
        break;
      case "a":
        keep.push(choice);
        break;

      case "t":
        animationBool = true;
        break;
      case "f":
        delete genres[choice];
        let addGenre = true;
        finalGenres.forEach((genre) => {
          if (genre === choice) {
            addGenre = false;
          }
        });
        if (addGenre) {
          finalGenres.push(choice);
        }
        break;
    }
    console.log("Final Genres: " + finalGenres);
    console.log("Genres: ");
    for (let key in genres) {
      console.log(key);
    }
  }

  //-----Card Rendering
  function updateCard(newCard) {
    selections = 0; //reset multiple choice selection count
    cardHistory.push(newCard.toLowerCase()); //Update card history
    let route = `./cards/${newCard.toLowerCase()}.ejs`;
    fetch(route)
      .then(function (response) {
        genreResolve(newCard);
        return response.text();
      })
      .then(function (template) {
        let renderedHTML = ejs.render(template, { tempGenres: tempGenres });
        card.innerHTML = renderedHTML;
        questionTitle.textContent = newCard;
      })
      .catch(function (err) {
        console.log("Failed to fetch page: ", err);
      });
  }

  //update to have certain parameters such as always include certain ones like sci-fi or action in good pick
  function genreResolve(newCard) {
    tempGenres = {};
    let genreKeys = Object.keys(genres);
    let romanceKeys = [
      "mystery",
      "comedy",
      "drama",
      "action",
      "thriller",
      "horror",
    ];
    switch (newCard) {
      case "GenreChoice":
        for (let i = 1; i < 10; i++) {
          let randomIndex = Math.floor(Math.random() * genreKeys.length);
          let randomGenre = genreKeys[randomIndex];
          genreKeys.splice(randomIndex, 1);
          tempGenres[`Genre${i}`] = randomGenre;
        }
        break;
      case "finalThree":
        let length = genreKeys.length;
        for (let i = 0; i < length; i++) {
          let randomIndex = Math.floor(Math.random() * genreKeys.length);
          let randomGenre = genreKeys[randomIndex];
          genreKeys.splice(randomIndex, 1);
          tempGenres[`Genre${i}`] = randomGenre;
        }
        break;
      case "romancePairing":
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

  function finishQuestionaire() {
    console.log("Final Genres: " + finalGenres);
    console.log("Max Release Years: " + releaseYear);
    let questionaireResults = {
      genres: finalGenres,
      years: releaseYear,
      animation: animationBool,
    };
    updateCard("finished");
    fetch("/questionaire/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionaireResults),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: " + response.status);
        }
        return response.text();
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors that occurred during the request
      });
    window.location.href = "/questionaire/results";
  }
});
