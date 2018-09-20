var express = require('express');
var router = express.Router();

const mypage = require('./mypage/index.js');
router.use('/mypage', mypage);

const home = require('./home/index.js');
router.use('/home', home);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
