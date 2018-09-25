var express = require('express');
var router = express.Router();

const franchise = require('./franchise.js');
router.use('/',franchise);

module.exports = router;