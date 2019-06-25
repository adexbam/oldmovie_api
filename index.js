//importing express
const express = require('express');
const app = express();
//importing morgan
const morgan = require('morgan');
//serves documentation.html file from public folder
app.use(express.static('public'));
//logs requests using Morgan’s “common” format
app.use(morgan('common'));

//declaring variable for movie list
let topTenMovies = [ {
    title : 'The Godfather',
    genre : 'Crime'
},
{
    title : 'Lord of the Rings',
    genre : 'Drama'
},
{
    title : 'Twilight',
    genre : 'Friction'
},
{
    title : 'The Shawshank Redemption',
    genre : 'Drama'
},
{
    title : ' Schindlers List',
    genre : 'Biography'
},
{
    title : 'Raging Bull ',
    genre : 'Sport'
},
{
    title : 'The Wizard of Oz',
    genre : 'Adventure'
},
{
    title : 'Gone with the Wind',
    genre : 'History'
},
{
    title : 'Citizen Kane',
    genre : 'Mystery'
},
{
    title : 'Casablanca',
    genre : 'Drama'
}
]

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to myFlix movies!')
});
app.get('/movies', function(req, res) {
  res.json(topTenMovies)
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Ooops! Something went wrong!');
});

// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.')
);
