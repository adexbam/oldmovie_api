// Integrating Mongoose with a REST API
const mongoose = require('mongoose');
const Models = require('./models.js');
const bodyParser = require('body-parser');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//importing express
const express = require('express');
const app = express();
//importing morgan
const morgan = require('morgan');
//serves documentation.html file from public folder
app.use(express.static('public'));
//logs requests using Morgan’s “common” format
app.use(morgan('common'));
app.use(bodyParser.json());
//import your “auth.js” file into your project
var auth = require('./auth')(app);
//require the Passport module and import the “passport.js” file
const passport = require('passport');
require('./passport');
//declaring variable for movie list

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to myFlix movies!');
});

// GET request for JSON object to return a list of ALL movies to the user
app.get("/movies", passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.status(201).json(movies)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ Title : req.params.Title })
  .then(function(movie) {
    res.json(movie)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// GET request for JSON object to return data about a genre by title
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({"Genre.Name":req.params.Genre})
  .then(function(movie) {
    res.status(201).json(movie.Genre);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error" + err);
  });
});

//GET request for JSON object to return data about a director (bio, birth year, death year) by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({"Director.Name":req.params.Name})
  .then(function(movie) {
    res.status(201).json(movie.Director);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("error" +err);
  });
});

//Add a user
app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, { $set :
  {
    Username : req.body.Username,
    Password : req.body.Password,
    Email : req.body.Email,
    Birthday : req.body.Birthday
  }},
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " +err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $push : { FavoriteMovies : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser)
    }
  })
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Name/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Name : req.params.Name }, {
  $pull: { Movies : req.params.MovieID }
  },
  { new : true }, // This line makes sure that the updated document is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
    else {
      res.json(updatedUser);
    }
  });
});

// Allow existing users to deregister
// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
})

// Allows access to requested file from "public" folder
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Ooops! Something went wrong!');
});

// listen for requests
app.listen(8080);
