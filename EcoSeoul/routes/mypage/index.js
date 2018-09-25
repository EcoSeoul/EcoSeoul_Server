var express = require('express');
var router = express.Router();

const login = require('./login.js');
router.use('/login', login);

const mygoods = require('./mygoods.js');
router.use('/mygoods', mygoods);

const mydonation = require('./mydonation.js');
router.use('/mydonation', mydonation);

const ecocard = require('./ecocard.js');
router.use('/ecocard', ecocard);

const mypage = require('./mypage.js');
router.use('/', mypage);

const exchange = require('./exchange.js');
router.use('/exchange', exchange);

module.exports = router;
