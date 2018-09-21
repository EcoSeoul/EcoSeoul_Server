var express = require('express');
var router = express.Router();

const mypage = require('./mypage/index.js');
router.use('/mypage', mypage);

const home = require('./home/index.js');
router.use('/home', home);

const board = require('./board/index.js');
router.use('/board',board);

const franchise =require('./franchise/index.js');
router.use('/franchise',franchise);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
