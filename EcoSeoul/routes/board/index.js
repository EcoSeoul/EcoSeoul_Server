var express = require('express');
var router = express.Router();


const cmtdelete = require('./board_cmtdelete.js');
router.use('/board_cmtdelete',cmtdelete);

const cmtmodify = require('./board_cmtmodify.js');
router.use('/board_cmtmodify',cmtmodify);

const cmtwrite = require('./board_cmtwrite.js');
router.use('/board_cmtwrite',cmtwrite);

const contentview = require('./board_contentview.js');
router.use('/board_contentview',contentview);

const boarddelete = require('./board_delete.js');
router.use('/board_delete',boarddelete);

const boardlike = require('./board_like.js');
router.use('/board_like',boardlike);

const boardmodify = require('./board_modify.js');
router.use('/board_modify',boardmodify);

const boardmytext = require('./board_mytext.js');
router.use('/board_mytext',boardmytext);

const boardwrite = require('./board_write.js');
router.use('/board_write',boardwrite);

const boardlist = require('./board_list.js');
router.use('/board_list',boardlist);

module.exports = router;