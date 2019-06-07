'use strict';

const
    express = require('express'),
    authController = require('../Controllers/auth');

let router = express.Router();

router.use('/', authController);

module.exports = router;