
'use strict'
var request = require('request');
var util = require('util');

async function recentlyPlayed(req, res, next) {

  try {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=10';

    const tracks = []

    var access_token = req.cookies['auth']

    let options = {
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }, json: true
    }

    const getRecentlyPlayed = util.promisify(request);

    const recentplayed = await getRecentlyPlayed(options).then(list => {

      list.body.items.map((track, idx) =>
        tracks.push({
          id: track.track.artists[0].id + idx,
          track_id: track.track.artists[0].id,
          date_time: track.played_at,
          artist_url: 'https://api.spotify.com/v1/artists/' + track.track.artists[0].id,
          type: 'recenetly played'
        })

      );
      return tracks
    })

    req.recentlyPlayed = recentplayed
    next()

  } catch (e) {

    console.log(e)

  } finally {

  }
};

async function playLists(req, res, next) {

  try {

  const url = 'https://api.spotify.com/v1/me/playlists';

  var access_token = req.cookies['auth']

  const playlistTrackList = [];

  let options = {
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    }, json: true
  }

  const getPlaylists = util.promisify(request);

  const playlists = await getPlaylists(options).then(list => {

      list.body.items.map((track, idx) =>

        playlistTrackList.push({
          id: idx,
          link: track.tracks.href,
          user: track.owner.display_name
        })
      )

    return playlistTrackList
  })

  req.playlists = playlists

  next()

} catch (e) {

  console.log(e)

} finally {

}

};

async function playListTracks(req, res, next) {

  try {

    const playlists = req.playlists;

    var access_token = req.cookies['auth']

    var tracks = [];

    await Promise.all(playlists.map(async (playlist, indx) => {

      let options = {
        url: playlist.link,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
          limit:50
        }, json: true
      }

      const getTrackList = util.promisify(request);

  
      await getTrackList(options).then(items => {


        items.body.items.map(async (t) => {

          if(tracks.length < 350){

            tracks.push({
              id: t.track.id,
              track_id: t.track.id,
              date_time: items.body.items[0].added_at,
              artist_url: 'https://api.spotify.com/v1/artists/' + t.track.artists[0].id,
              type: 'playlist'
            });

        }

        })
      })
    }))

    req.playlistTracks = tracks

    next()

  } catch (e) {

      console.log(e)

  } finally {

  }

}

module.exports = {
  recentlyPlayed: recentlyPlayed,
  playLists: playLists,
  playListTracks: playListTracks
};