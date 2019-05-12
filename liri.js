require("dotenv").config();
fs = require("fs");

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var moment = require('moment');

var command = process.argv[2];
var arg = process.argv.slice(3).join(" ");

commandManager(command, arg);

//Function for song search
function spotifyThis (songTitle){

    if (songTitle === '') {
        songTitle = "Ace of Base The Sign";
    }
    
    spotify.search({ type: 'track', query: songTitle, limit : 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }else{
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log(JSON.stringify(data));
            //return(JSON.stringify(data));
            logger("spotify-thi-song", JSON.stringify(data));
        }
      });
}


//Function for concert search
function concertThis (artistName){
    var queryUrl = "https://rest.bandsintown.com/artists/"+ artistName +"/events?app_id=codingbootcamp";


    request(queryUrl, function(error, response, body) {
        var result = [];

      if (!error && response.statusCode === 200) {
    
        var JS = JSON.parse(body);
        for (i = 0; i < JS.length; i++)
        {
          var dateTime = moment(JS[i].datetime).format('DD-MM-YYYY');
          console.log("Name: " + JS[i].venue.name);
          console.log("City: " + JS[i].venue.city);
          if (JS[i].venue.region !== "")
          {
            console.log("Country: " + JS[i].venue.region);
          }
          console.log("Country: " + JS[i].venue.country);
          console.log("Date: " + dateTime);
        }
        
        logger("concert-this", JSON.stringify(body));
      }
    });
    
}

function movies(movie) {

    if (movie === '') {
        movie = "Mr. Nobody";
    }
  
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    
    console.log(queryUrl);
    var result = "";
    request(queryUrl, function(err, res, body) {
    result = JSON.parse(body);
      if (!err && res.statusCode === 200) {
        console.log("Title: " + result.Title);
        console.log("Release Year: " + result.Year);
        console.log("IMDB Rating: " + result.imdbRating);
        console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
        console.log("Country: " + result.Country);
        console.log("Language: " + result.Language);
        console.log("Plot: " + result.Plot);
        console.log("Actors: " + result.Actors);
        logger("movies-this", JSON.stringify(body));
      }
    });

   
  };

    function random() {

    fs.readFile('random.txt', "utf8", function(error, data){
        if (error) {
            return display(error);
        }
            var fileData = data.split(",");
            var command = fileData[0];
            var arg = fileData[1].trim().slice(1, -1);
            commandManager(command, arg);
        });

    };
   

   function commandManager(command, arg){
    var result = "";

    //In case the command is to search for a concert
    if (command === 'concert-this'){
        result = concertThis(arg);
    }

    //In case the command is to search for a song
    if (command === 'spotify-this-song'){
        result = spotifyThis(arg);
    }

    //In case the command is to search for a movie
    if (command === 'movie-this'){
        result = movies(arg);
    }

    //In case the command is anything else
    if (command === 'do-what-it-says'){
        result = random();
    }
    
    logger(command, result);
}

   //Logs each command an result
   function logger(command, result) {
   
    fs.appendFile('log.txt', "Command: " + command + "--- Query Result: " + result, function(err) {
        if (err) return display('Error logging data to file: ' + err);	
    });

}