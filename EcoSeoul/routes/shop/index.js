var express = require('express');
var router = express.Router();

const shop = require('./shop.js');
router.use('/', shop);

module.exports = router;
