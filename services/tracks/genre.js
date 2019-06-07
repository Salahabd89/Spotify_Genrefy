'use strict'
var request = require('request');

 function getGenres(tracks, access_token){

   const tracks_ = tracks
   const genre = []
   const genresP =  tracks.map( async (track,idx) => {
                  
            const genres = new Promise( function(resolve, reject) { request.get({
                url: track.artist_url,
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`
                },
                json: true
                }, ( (error, response, body) => {
                    genre.push({
                                date_time: tracks_[idx].date_time,
                                genre: body.genres })
                    resolve(genre)
                }))})
             
                return genres
            });
    
return  Promise.all(genresP)        

}

async function getGenreRecentlyPlayed(req,res, next) {

    var access_token =  req.cookies['auth'];
    var tracks =  req.recentlyPlayed;
    req.data1 =  await getGenres(tracks, access_token)
     console.log(req)
    return res.json(req.data1)
     
};

function getGenreRecentlyPlayLists(req,res, next) {

    var access_token =  req.cookies['auth'];
    
    var tracks =  req.playlists;

    for(var i = 0; i < tracks.length; i++){
     
        const url = 'https://api.spotify.com/v1/artists/' + tracks[i].track_id;
      
        const index = i;
        console.log(index);
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
          
            tracks[index].genre = body.genres
            console.log(index);
            if(index == tracks.length - 1){
                console.log("done");
                req.data2 = tracks
           
                next()
            }
          } 
        })
    }
};

module.exports = {
    getGenreRecentlyPlayed: getGenreRecentlyPlayed,
    getGenreRecentlyPlayLists: getGenreRecentlyPlayLists
};