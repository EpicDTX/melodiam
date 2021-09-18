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
  	res.render('index', { title: 'Melodiam' });
});

/* GET result page for artists. */
router.get('/search/artists', function(req, res, next) {
	// Search artists whose name contains query
	const query = req.query
	try{
		spotifyApi.searchArtists(query['artist'])
			.then(function(data) {
				res.render('result-artist', { title:'Search Results For Artists: "'+query['artist']+'"', data: data.body.artists.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch{
		res.render('error', { error: err });
	}
});

/* GET an artist. */
router.get('/artists/:artist_id', function(req, res, next) {
	// Get Artist from id
	artist_id = req.params.artist_id;
	try{
		spotifyApi.getArtist(artist_id)
			.then(function(data) {
				res.json(data.body);
				// res.render('show-artist', { data: data.body.artists.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET result page for tracks. */
router.get('/search/tracks', function(req, res, next) {
	// Search artists whose name contains query
	const query = req.query
	try{
		spotifyApi.searchTracks("track:"+query['track'])
			.then(function(data) {
				// res.json(data.body);
				res.render('result-track', { title:'Search Results For Tracks: "'+query['track']+'"', data: data.body.tracks.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch{
		res.render('error', { error: err });
	}
});

module.exports = router;
