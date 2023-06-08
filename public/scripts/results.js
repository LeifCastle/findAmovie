$(document).on("click", ".seenButton", (event) => {
  let data = $(event.target).attr("id");
  let [id, title] = data.split(",");
  let movieUpdate = {
    id: id,
    title: title,
  };
  if (
    $(event.target).text() === "Undo" ||
    $(event.target).text().trim() === "Remove"
  ) {
    movieUpdate.seen = false;
    $(event.target).parent().next().remove();
    $(event.target).text("I've Seen This");
    fetch("/questionaire/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieUpdate),
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
  } else if ($(event.target).text().trim() === "I've Seen This") {
    movieUpdate.seen = true;
    let overlay = $("<div></div>").addClass("seen");
    $(event.target).parent().parent().append(overlay);
    if ($(event.target).parent().parent().attr("id") === "seenMovies") {
      $(event.target).text("Remove");
    } else {
      $(event.target).text("Undo");
    }
    console.log(movieUpdate);
    fetch("/questionaire/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieUpdate),
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
  }
});
