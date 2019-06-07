
'use strict'
var request = require('request');

 async function getrecentlyPlayed(list){

  const tracks = []

     await list.map( (track, idx) => 
                tracks.push({
                    id: track.track.artists[0].id + idx,
                    track_id: track.track.artists[0].id,
                    date_time: track.played_at,
                    artist_url: 'https://api.spotify.com/v1/artists/' + track.track.artists[0].id,
                    type: 'recenetly played'
                })
            );

  return await Promise.all(tracks)
}
async function recentlyPlayed(req, res, next) {

  try {

    const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=10';

    var access_token = req.cookies['auth']
    request.get({
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      json: true
    }, async function (error, response, body) {

      if (!error && response.statusCode === 200) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        req.recentlyPlayed  = await getrecentlyPlayed(body.items)
        next()
      }
    })

    
  } catch (e) {
    
  } finally{
   
  }
};

function playLists(req, res, next) {

  
  const url = 'https://api.spotify.com/v1/me/playlists';

  var access_token = req.cookies['auth']

  var playlistTrackList = [];

  request.get({
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      

      for(var i=0; i < body.items.length; i++){
      playlistTrackList.push({
          id: i,
          link: body.items[i].tracks.href,
          user: body.items[i].owner.display_name
      });
      }

     if (req.playlistTracks == null){

        req.playlistTrackslist = playlistTrackList;

      } 

      next()

    }
  })
};

function playListTracks(req, res, next) {

  const trackListUrl = req.playlistTrackslist;
 
  var access_token = req.cookies['auth']
 
  var tracks = [];

  var playlists_completed = 0;




  for(var i = 0; i < trackListUrl.length; i++){

  const url = trackListUrl[i].link

  var index = i;


  request.get({
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    },
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      for(var j = 0; j < body.items.length; j++){
        tracks.push({
          id: body.items[j].track.artists[0].id + j,
          track_id: body.items[j].track.artists[0].id,
          date_time: body.items[j].added_at,
          type: 'playlist'
        });

        if(j == body.items.length - 1){

           playlists_completed = playlists_completed + 1
        }

      }
      
      //console.log("PLay List completed: " + playlists_completed)
      //console.log("URL Length: " + trackListUrl.length)
      if (playlists_completed ==  trackListUrl.length){

        
        req.playlists = tracks
        console.log(req.playlists)

        next()
     }
    }
  })
 }
};

module.exports = {
  recentlyPlayed: recentlyPlayed,
  playLists: playLists,
  playListTracks: playListTracks
};