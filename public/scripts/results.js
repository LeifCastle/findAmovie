$(document).on("click", ".seenButton", (event) => {
  let movieUpdate = {};
  if ($(event.target).text() === "Undo") {
    movieUpdate.unseen = $(event.target).attr("id");
    $(event.target).parent().next().remove();
    $(event.target).text("I've seen this");
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
  } else {
    movieUpdate.seen = $(event.target).attr("id");
    let overlay = $("<div></div>").addClass("seen");
    $(event.target).parent().parent().append(overlay);
    $(event.target).text("Undo");
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
