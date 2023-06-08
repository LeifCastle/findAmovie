document.addEventListener("DOMContentLoaded", () => {
  $(document).on("click", ".profileOptionBttn", function () {
    console.log("clicked");
    let id = $(this).attr("id");
    $(".profileOption").attr("hidden", "hidden");
    $(`.${id}`).removeAttr("hidden");
  });
});
