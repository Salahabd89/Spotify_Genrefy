'use strict';

const
    express = require('express'),
    authentication = require('../../services'); 

let router = express.Router();

router.use(require('cookie-parser')());

router.get('/auth', authentication.login);
router.get('/callback', authentication.callback);
router.get('/refreshtoken', authentication.refreshtoken);

module.exports = router;