var express = require('express');
var router = express.Router();

const donation = require('./donation.js');
router.use('/', donation);


module.exports = router;
