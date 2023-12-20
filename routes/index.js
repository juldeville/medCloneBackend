var express = require("express");
var router = express.Router();

const apiKey = process.env.NEWS_API_KEY;

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/getArticles", (req, res) => {
  fetch(`https://newsapi.org/v2/everything?sources=the-verge&apiKey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        res.json({ result: true, articles: data.articles });
      } else res.json({ result: false, error: "Error Occured" });
    });
});

module.exports = router;
