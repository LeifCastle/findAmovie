document.addEventListener("DOMContentLoaded", () => {
  //Global Variables
  let progress = 1;

  //Query Selectors
  let back = document.querySelector("#back");
  let card = document.querySelector("#cardParent");
  let questionTitle = document.querySelector("#questionTitle");

  let cardHistory = ["Audience"];

  //Event Listeners
  $(document).on("click", ".choice", (event) => {
    console.log(event.target.id);
    runChoice(event.target.id);
    progress++;
    checkProgress();
  });
  back.addEventListener("click", () => {
    cardHistory.pop();
    updateCard(cardHistory[cardHistory.length - 1]);
    //removies the cardHistory pushed by the function
    cardHistory.pop();
    progress--;
    checkProgress();
  });

  checkProgress();

  //Based on choice
  function runChoice(choice) {
    switch (choice) {
      case "me":
      case "friends":
        updateCard("genreChoice");
        break;
      case "couples":
        updateCard("Romance");
        break;
      case "family":
        updateCard("Maturity");
        break;
    }
  }

  function updateCard(choice) {
    cardHistory.push(choice.toLowerCase());
    let route = `./cards/${choice.toLowerCase()}.html`;
    fetch(route)
      .then(function (response) {
        return response.text();
      })
      .then(function (template) {
        card.innerHTML = template;
        questionTitle.textContent = choice;
      })
      .catch(function (err) {
        console.log("Failed to fetch page: ", err);
      });
  }

  function checkProgress() {
    if (progress === 1) {
      back.setAttribute("hidden", "hidden");
    } else {
      back.removeAttribute("hidden");
    }
  }
});
