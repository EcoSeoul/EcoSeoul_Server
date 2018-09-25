var express = require('express');
var router = express.Router();

const comment = require('./comment.js');
router.use('/', comment);

module.exports = router;
