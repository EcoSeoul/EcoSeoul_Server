var express = require('express');
var router = express.Router();

const calc = require('./calc.js');
router.use('/calculate', calc);

const main = require('./main.js');
router.use('/', main);

module.exports = router;
