require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var moment = require('moment');

var command = process.argv[2];
var arg = process.argv.slice(3).join(" ");

//In case the command is to search for a concert
if (command === 'concert-this'){
    concertThis(arg);
}

//In case the command is to search for a song
if (command === 'spotify-this-song'){
    spotifyThis(arg);
}

//In case the command is to search for a movie
if (command === 'movie-this'){

}

//In case the command is anything else
if (command === 'do-what-it-says'){

}


//Function for song search
function spotifyThis (songTitle){
    spotify.search({ type: 'track', query: songTitle, limit : 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }else{
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
      });
}


//Function for concert search
function concertThis (artistName){
    var queryUrl = "https://rest.bandsintown.com/artists/"+ artistName +"/events?app_id=codingbootcamp";


    request(queryUrl, function(error, response, body) {
    
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
      }
    });
    
}