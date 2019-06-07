'use strict';

const apiRoute = require('./apis');
const login = require('./login');

function init(server) {
    
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.use('/api', apiRoute);
    server.use('/login', login);
}

module.exports = {
    init: init
};