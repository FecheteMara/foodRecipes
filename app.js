//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const _ = require('lodash');
const {
  url
} = require("inspector");
require('dotenv').config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/", function (req, res) {
  const apiKey = process.env.apiKey;
  const appId = process.env.appId;

  const q = req.body.foodTitle;
  const url = "https://api.edamam.com/api/recipes/v2?type=public&q=" + q + "&app_id=" + appId + "&app_key=" + apiKey;

  https.get(url, function (response) {

    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', () => {
      const parsedData = JSON.parse(rawData);
      const lables = parsedData.hits;
      res.render("recipes_list", {
        lables: lables
      })
    });
  }).on('error', (e) => {
    console.error(e);
  });

});

app.get("/posts/:postName", function (req, res) {

  let postName = req.params.postName;
  let ingredients = req.query.ingredients;
  let cookingTime = req.query.time;
  let fullRecipe = req.query.full;
  if (cookingTime === "0") {
    cookingTime = "~50";
  }

  res.render("post", {
    title: postName,
    ingredients: ingredients.split(","),
    cookingTime: cookingTime,
    fullRecipe: fullRecipe
  })

});


app.listen(3000, function () {
  console.log("Server started on port 3000.");
});