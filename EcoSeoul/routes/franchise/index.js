var express = require('express');
var router = express.Router();

const franchisegu = require('./franchise_gu.js');
router.use('/franchise_gu',franchisegu);

const listview = require('./franchise_listview.js');
router.use('/franchise_listview',listview);

module.exports = router;