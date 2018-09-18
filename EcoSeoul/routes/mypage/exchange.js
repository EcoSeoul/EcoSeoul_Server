const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) =>{
   let user_idx = req.body.user_idx;
   let how_much = req.body.how_much;

   if (!user_idx || !how_much) {
       res.status(400).send({
           status : "false",
           message : "Null Value : user index and how much"
       });
   } else {
       //에코 마일리지 -> 에코 머니 환전 비율은???
   }
});


module.exports = router;
