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
let movies = [ {
    title : 'The Godfather',
    genre : 'Crime',
    description:'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    director: 'Francis Ford Coppola',
    imageURL: '#'
},
{
    title : 'Lord of the Rings',
    genre : 'Drama',
    description:'The Lord of the Rings is a film series of three epic fantasy adventure films directed by Peter Jackson, based on the eponymous novel written by J. R. R. Tolkien',
    director: 'Peter Jackson',
    imageURL: '#'
},
{
    title : 'Twilight',
    genre : 'Friction',
    description:'High-school student Bella Swan (Kristen Stewart), always a bit of a misfit, doesn\'t expect life to change much when she moves from sunny Arizona to rainy Washington state.',
    director: 'Catherine Hardwicke',
    imageURL: '#'
},
{
    title : 'The Shawshank Redemption',
    genre : 'Drama',
    description:'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    director: 'Frank Darabont',
    imageURL: '#'
},
{
    title : ' Schindlers List',
    genre : 'Biography',
    description:'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
    director: 'Steven Spielberg',
    imageURL: '#'
},
{
    title : 'Raging Bull',
    genre : 'Sport',
    description:'The life of boxer Jake LaMotta, who\'s violence and temper that lead him to the top in the ring destroyed his life outside of it.',
    director: 'Martin Scorsese',
    imageURL: '#'
},
{
    title : 'The Wizard of Oz',
    genre : 'Adventure',
    description:'When a tornado rips through Kansas, Dorothy (Judy Garland) and her dog, Toto, are whisked away in their house to the magical land of Oz',
    director: 'Victor Fleming',
    imageURL: '#'
},
{
    title : 'Gone with the Wind',
    genre : 'History',
    description:'Gone with the Wind is a 1939 American epic historical romance film adapted from the 1936 novel by Margaret Mitchell. The film was produced by David O. Selznick of Selznick International Pictures and directed by Victor Fleming.',
    director: 'Victor Fleming',
    imageURL: '#'
},
{
    title : 'Citizen Kane',
    genre : 'Mystery',
    description:'Following the death of publishing tycoon, Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance; Rosebud.',
    director: 'Orson Welles',
    imageURL: '#'
},
{
    title : 'Casablanca',
    genre : 'Drama',
    description:'A cynical American expatriate struggles to decide whether or not he should help his former lover and her fugitive husband escape French Morocco.',
    director: 'Michael Curtiz',
    imageURL: '#'
}
]

let users = [{
        username: 'Bojibam',
        email: 'bojibam@mail.com',
        password: '12345678',
        dateOfBirth: '01/01/1994',
        favorites: []
    },
    {
        username: 'Markbam',
        email: 'mark@mail.com',
        password: '12345678',
        dateOfBirth: '03/05/1989',
        favorites: []
    }
];

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to myFlix movies!');
});
// GET request for JSON object to return a list of ALL movies to the user
app.get('/movies', function(req, res) {
  res.json(movies);
});
// GET request for JSON object to return data about a single movie by title
app.get('/movies/:title', function (req, res) {
    res.json(movies.find(function (movie) {
        return movie.title === req.params.title
    }));
});
// GET request for JSON object to return data about a genre by title
app.get('/movies/:title/genre', function (req, res) {
    let movie = movies.find((movie) => {
        return movie.title === req.params.title;
    });

    if (movie) {
    res.status(201).send('The genre of ' + movie.title + ' is ' + movie.genre);
} else {
    res.status(404).send('Movie with the title ' + req.params.title + ' was not found.');
}
});
//GET request for JSON object to return data about a director (bio, birth year, death year) by name
app.get('/directors/:name', function (req, res) {
    res.send('The director\'s bio, birth year, death year returned.');
});

//POST that Allows new users to register
app.post('/users', function (req, res) {
    let newUser = req.body;

    if (!newUser.username) {
        const message = 'Missing username';
        res.status(400).send(message);
    } else {
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:username/:password', function (req, res) {
    res.send('Your username/password successfully updated.');
});
app.put('/users/:username/:email/:dateofbirth', function (req, res) {
    res.send('Your data successfully updated.');
});

// Allow users to add a movie to their list of favorites
app.post('/users/:username/favorites', function (req, res) {
    let newFavorite = req.body;

    if (!newFavorite.title) {
        const message = "Missing movie title";
        res.status(400).send(message);
    } else {
        let user = users.find(function (user) {
            return user.username === req.params.username
        });
        user.favorites.push(newFavorite);
        res.status(201).send(user.favorites);
    }
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/favorites', function (req, res) {
    res.send('One favorite movie deleted')
});

// Allow existing users to deregister
app.delete('/users/:username', function (req, res) {
    res.send('User profile has been deleted')
});

// Allows access to requested file from "public" folder
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Ooops! Something went wrong!');
});

// listen for requests
app.listen(8080);
