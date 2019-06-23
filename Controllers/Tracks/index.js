'use strict';

const express = require('express');
const tracks = require('../../services/tracks/tracks.js');  
const genre = require('../../services/tracks/genre.js'); 
const dataFactory = require('../../services/tracks/dataFactory.js'); 
const cors = require('CORS');

var router = express.Router();

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then pass them to cors:
router.use(cors(corsOptions));

router.use(require('cookie-parser')());

router.get('/tracks',  tracks.recentlyPlayed,
                       tracks.playLists,
                       tracks.playListTracks,
                       genre.getGenreRecentlyPlayed,
                       genre.getGenrePlayLists,
                       dataFactory.analyser
                       ); 


module.exports = router;