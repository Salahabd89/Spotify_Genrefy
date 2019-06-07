'use strict';

const
    express = require('express'),
    tracksController = require('../../Controllers/Tracks');

let router = express.Router();

router.use('/', tracksController);

module.exports = router;