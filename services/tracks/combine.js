
'use strict'
var request = require('request');


function combine(req,res) {

    console.log("here")
    const result = {};
    Object.keys(req.data1)
    .forEach(key => result[key] = req.data1[key]);

    Object.keys(req.data2)
    .forEach(key => result[key] = req.data2[key]);

    console.log(result)
    return res.json(result)


};

module.exports = {
    combine: combine
};