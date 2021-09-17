var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '0f1244057a924345ad1efeea30b6b2e6',
  clientSecret: 'b4af642c48da4ac4b1e671e09c588cd5',
  redirectUri: 'http://localhost/callback'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Music4U' });
});

module.exports = router;
