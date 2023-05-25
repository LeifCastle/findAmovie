const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", function (req, res) {
  return res.render("browse/browse", { searchResult: null });
});

router.post("/", function (req, res) {
  let base = "https://api.themoviedb.org";
  let query = req.body.paramater;
  let append = "append_to_response=images"; /*,videos as well*/
  console.log(query);
  axios
    .get(
      `${base}/3/search/movie?query=${query}&api_key=f95c55e2a9a5625ec1d3b5c42e143840&${append}`
    )
    .then((response) => {
      //console.log(response.data.results); //response.data.results is an array of objects
      res.render("browse/browse", { searchResult: response.data.results });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
