var express = require('express');
var router = express.Router();

const mypage = require('./mypage/index.js');
router.use('/mypage', mypage);

const home = require('./home/index.js');
router.use('/home', home);

const board = require('./board/index.js');
router.use('/board', board);

const comment = require('./comment/index.js');
router.use('/comment', comment);

const franchise = require('./franchise/index.js');
router.use('/franchise', franchise);

const donation = require('./donation/index.js');
router.use('/donation', donation);

const shop = require('./shop/index.js');
router.use('/shop', shop);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
