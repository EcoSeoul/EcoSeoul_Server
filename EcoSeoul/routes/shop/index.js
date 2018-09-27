var express = require('express');
var router = express.Router();

const add = require('./add.js');
router.use('/add', add);

const shop = require('./shop.js');
router.use('/', shop);

module.exports = router;
