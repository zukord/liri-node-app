var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment");
var file = require('file-system');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);

var omdb = new (require('omdbapi'))(keys.omdb.key);
var bandsintown = require('@datafire/bandsintown').create();

var command = process.argv[2];
var argument = process.argv.slice(3);

var commandList = {
    'concert-this': concertThis,
    'spotify-this-song': spotifyThisSong,
    'movie-this': movieThis,
    'do-what-it-says': random,
};

if (commandList[command]) {
    commandList[command](argument);
} else {
    console.log('Unrecognized command');
}


function spotifyThisSong(song) {

    if(song.length === 0){
        console.log("triggered")
        spotify
            .search({
                type: 'track',
                query: '\"The%20Sign\"',
                limit: 1,
            })
            .then(function (response) {
                    console.log("Preview: " + response.tracks.items.track.preview_url);
                    console.log("Name: " + response.tracks.items.track.name);
                    console.log("Artist: " + response.tracks.items.track.artists[0].name);
                    console.log("Album: " + track.album.name);
            });
    } else {

    spotify
        .search({
            type: 'track',
            query: song,
            limit: 1,
        })
        .then(function (response) {
            response.tracks.items.forEach(function (track) {
                console.log("Preview: " + track.preview_url);
                console.log("Name: " + track.name);
                console.log("Artist: " + track.artists[0].name);
                console.log("Album: " + track.album.name);
            })
        });
    }
}

function movieThis(show) {

    if(show.length === 0){
        omdb.get({
            title: "Mr. Nobody"
        }).then(res => {
        console.log('%s (%d) %d/10, %d/10', res.title, res.year, res.imdbrating, res.metascore);
        console.log(res.country);
        console.log(res.language);
        console.log(Object.keys(res.actors).map(function(k){return res.actors[k]}).join(", "));
        console.log(res.plot);
        }).catch(console.error);
    } else {
omdb.get({
    title: show
}).then(res => {
console.log('%s (%d) %d/10, %d/10', res.title, res.year, res.imdbrating, res.metascore);
console.log(res.country);
console.log(res.language);
console.log(Object.keys(res.actors).map(function(k){return res.actors[k]}).join(", "));
console.log(res.plot);
}).catch(console.error);
    }
}

function concertThis(artist){
    var search = artist.join(' ')
    bandsintown.artistEvents({
        artistname: search,
        app_id: keys.bandsintown.key,
      }).then(data => {
          for(var i=0; i < data.length; i++){
            console.log(data[i].venue.name);
            if(data[i].venue.region === ''){
                console.log(data[i].venue.city + ", " + data[i].venue.country);
            } else {
                console.log(data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
            }
            console.log(moment.utc(data[i].datetime).format('MM/DD/YYYY') + "\n");
        }
            
      }).catch(console.error);
}
function random(){
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) throw err;
        var dataArr = data.split(",")
        console.log(dataArr)

    })
}