const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');



router.get('/:board_idx',async(req, res)=> {
    let board_idx = req.params.board_idx;


    if(!board_idx){
        res.status(400).send({
            message : "NULL VALUE"
        });
    }else{
      let boardcontentQuery = `SELECT DISTINCT * FROM eco.Board WHERE board_idx = ?`;
      let boardcontentResult = await db.queryParam_Arr(boardcontentQuery,[board_idx]);

      if(!boardcontentResult){
          res.status(500).send({
              message : "Server Error"
          });
      }else{
          res.status(200).send({
              status : "True",
              message : "Success",
              Data : boardcontentResult
          });
      }
    }

});

module.exports = router;