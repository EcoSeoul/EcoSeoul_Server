var express = require('express');
var router = express.Router();

const donation = require('./donation.js');
router.use('/donation', donation);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
