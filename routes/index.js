var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
	clientId: '0f1244057a924345ad1efeea30b6b2e6',
	clientSecret: 'b4af642c48da4ac4b1e671e09c588cd5',
	redirectUri: 'http://localhost/callback'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
	function(data) {
	  console.log('The access token expires in ' + data.body['expires_in']);
	  console.log('The access token is ' + data.body['access_token']);
  
	  // Save the access token so that it's used in future calls
	  spotifyApi.setAccessToken(data.body['access_token']);
	},
	function(err) {
	  console.log('Something went wrong when retrieving an access token', err);
	}
  );

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Music4U' });
});

/* GET home page. */
router.get('/search/artists', function(req, res, next) {
	// Search artists whose name contains query
	const query = req.query
	try{
		spotifyApi.searchArtists(query['artist'])
			.then(function(data) {
				res.render('result-artist', { title:'Search Results For Artist: "'+query['artist']+'"', data: data.body.artists.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch{
		res.render('error', { error: err });
	}
});

/* GET home page. */
router.get('/search/tracks', function(req, res, next) {
	// Search artists whose name contains query
	const query = req.query
	try{
		spotifyApi.searchTracks("track:"+query['track'])
			.then(function(data) {
				res.render('result-track', { title:'Search Results For Track: "'+query['track']+'"', data: data.body.tracks.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch{
		res.render('error', { error: err });
	}
});

module.exports = router;
