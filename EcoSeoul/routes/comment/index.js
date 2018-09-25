var express = require('express');
var router = express.Router();

const comment = require('./comment/index.js');
router.use('/', comment);

module.exports = router;
