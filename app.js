// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const Movie = require('./models/Movie.model')
const mongoose = require("mongoose");

const app = express();


// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-cinema';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

app.get("/", function (req, res, next) {
    res.render("home", { title: "lab-express-cinema" });
  });
  
 
  app.get('/movies', function(req, res, next) {
    Movie.find()
    .then(function(movies){
    res.render('movies', {movies: movies});
  })
  .catch(function (error) {
    console.log(error);
  });
});

app.get("/movies/:details", function(req, res) {
  Movie.findById(req.params.details)
    .then(function (foundMovie) {
      res.render("movie-details", { foundMovie: foundMovie });
    })
    .catch(function (error) {
      res.json(error);
    });
});


app.post("/movies", function (req, res, next) {
    Movie.create({
      title: req.body.title,
      director: req.body.director,
      stars: req.body.stars,
      image: req.body.image,
      description: req.body.description,
      showtimes: req.body.showtimes,
    })
      .then(function (movies) {
        res.redirect("/movies");
      })
      .catch(function (error) {
        res.redirect("/movies");
      });
  });

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

mongoose
  .connect('mongodb://localhost/lab-express-cinema')
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

module.exports = app;
