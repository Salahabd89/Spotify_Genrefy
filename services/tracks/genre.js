'use strict'
var request = require('request');
var util = require('util');
var delay = require('delay');
var axios = require('axios');
var SmartQueue = require('smart-request-balancer');

const queue = new SmartQueue({
    rules: {
      spotify_api: { // Rule for sending private message via telegram API
        rate: 80,            // one message
        limit: 60,           // per second
        priority: 1
      }
    }
  });

async function getGenres(tracks, access_token) {

    const getGenre = util.promisify(request);

    await Promise.all(tracks.map(async (track, indx) => {

        let options =
        {
            url: track.artist_url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`
            }
        }

        const genre = await getGenre(options).then(items => {

            let track = JSON.parse(items.body)
            return track.genres

        })
        tracks[indx].genre = genre

    }))

    return tracks

}

async function rateLimitDelay(n) {

    let miliseconds  = (n * 1000)
    console.log("Waiting for " + miliseconds)
    await delay(miliseconds);

}

async function getGenreRecentlyPlayed(req, res, next) {

    var access_token = req.cookies['auth'];
    var tracks = req.recentlyPlayed;
    req.data1 = await getGenres(tracks, access_token)

    next()
};

async function getGenrePlayLists(req, res, next) {

   

    try {

        var access_token = req.cookies['auth'];

        var tracks = req.playlistTracks;

        let i = 0;

        await Promise.all(tracks.map(async (track, indx) => {

            if (track.track_id != null ) {

                let options =
                {
                    url: track.artist_url,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`
                    }, json: true
                }


                    const genre = await queue.request( (retry) =>  axios(options).then( response => {

                        if (response.status == 200) {
                            console.log(response.status )
                            return response.data.genres

                        }  
                      }
                      
                    ).catch(error =>{
                        
                        console.log(error)

                        return retry(5) // usually 300 seconds

                    }),1,'spotify_api')

                    tracks[indx].genre = genre
            }
        }))

        req.data2 = tracks
        next()


    } catch (e) {
        //console.log(e)

    } finally {

    }
};

module.exports = {
    getGenreRecentlyPlayed: getGenreRecentlyPlayed,
    getGenrePlayLists: getGenrePlayLists
};