
'use strict'
var request = require('request');


function countGenreOccurance (ary, classifier) {
    classifier = classifier || String;
    return ary.reduce(function (counter, item) {
        var p = classifier(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
        return counter;
    }, {})
};


async function analyser(req,res){

   var tracks = req;

   let genres = combine(tracks);

   console.log(countGenreOccurance(genres))
  
}


function combine(req) {

    const result = [];

    req.data1.map(tracks =>{
        tracks.genre.map(element => {
            result.push(element)
        });
    })

    req.data2.map(tracks =>{
        tracks.genre.map(element => {
            result.push(element)
        });
    })

    
    return result;

};

module.exports = {
    analyser: analyser
};