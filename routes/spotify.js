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

/* GET result page for artists. */
router.get('/artists', function(req, res, next) {
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
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET an artist. */
router.get('/artists/:artist_id', async function(req, res, next) {
	artist_id = req.params.artist_id;
	try{
		// Get an artist from id
		const artist = await spotifyApi.getArtist(artist_id).then(function(data) {
			return data.body;
		}, function(err) {
			res.render('error', { error: err });
		});
		
		// Get an artist's albums
		const albums = await spotifyApi.getArtistAlbums(artist_id).then(function (data) {
			return data.body.items;
		}, function(err) {
			res.render('error', { error: err });
		});

		// Get an artist's top tracks
		const top_tracks = await spotifyApi.getArtistTopTracks(artist_id, 'AU').then(function(data) {
			return data.body.tracks;
		}, function(err) {
			res.render('error', { error: err });
		});
		
		// Get artists related to an artist
		const related_artists = await spotifyApi.getArtistRelatedArtists(artist_id).then(function(data) {
			return data.body.artists;
		}, function(err) {
			res.render('error', { error: err });
		});

		res.render('show-artist', { artist, albums, top_tracks, related_artists });
	}
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET result page for tracks. */
router.get('/tracks', function(req, res, next) {
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
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET a track. */
router.get('/tracks/:track_id', async function(req, res, next) {
	track_id = req.params.track_id;
	try{
		// Get an track from id
		const track = await spotifyApi.getTrack(track_id).then(function(data) {
			return data.body;
		}, function(err) {
			res.render('error', { error: err });
		});

		// Get an artists of track
		var artists = [];
		for(track_artist of track.artists) {
			artist = await spotifyApi.getArtist(track_artist.id).then(function(data) {
				return data.body;
			}, function(err) {
				res.render('error', { error: err });
			});
			artists.push(artist);
		}

		/* Get Audio Features for a Track */
		const features = await spotifyApi.getAudioFeaturesForTrack(track_id)
			.then(function(data) {
				return data.body;
			}, function(err) {
				res.render('error', { error: err });
			});
		
		res.render('show-track', { track, artists, features });
	}
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET result page for tracks. */
router.get('/albums', function(req, res, next) {
	// Search artists whose name contains query
	const query = req.query
	try{
		spotifyApi.searchAlbums("album:"+query['album'])
			.then(function(data) {
				res.render('result-album', { title:'Search Results For Album: "'+query['album']+'"', data: data.body.albums.items });
			}, function(err) {
				res.render('error', { error: err });
			});
	}
	catch(err){
		res.render('error', { error: err });
	}
});

/* GET an album. */
router.get('/albums/:album_id', async function(req, res, next) {
	album_id = req.params.album_id;
	try{
		// Get an track from id
		const album = await spotifyApi.getAlbum(album_id).then(function(data) {
			return data.body;
		})

		// Get an artists of album
		var artists = [];
		for(album_artist of album.artists) {
			artist = await spotifyApi.getArtist(album_artist.id).then(function(data) {
				return data.body;
			}, function(err) {
				res.render('error', { error: err });
			});
			artists.push(artist);
		}
		
		res.render('show-album', { album, artists });
	}
	catch(err){
		res.render('error', { error: err });
	}
});

module.exports = router;