var express = require('express');
var router = express.Router();

const boardlike = require('./board_like.js');
router.use('/like',boardlike);

const boardlist = require('./board_list.js');
router.use('/list',boardlist);

const board = require('./board.js');
router.use('/',board);

module.exports = router;