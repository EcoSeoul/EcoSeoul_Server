var express = require('express');
var router = express.Router();

const main = require('./main.js');
router.use('/', main);

module.exports = router;
