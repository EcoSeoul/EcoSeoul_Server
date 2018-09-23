const express = require('express');
const router = express.Router();
const db = require('../../moudle/pool.js');
const mysql = require('mysql');


router.get('/', async(req, res) => {
  pool.getConnection(function(err,connection){
      if(err){
          res.status(500).send({
              message : " Internal Server Err"
          });
          connection.release();
      }else{
          let guQuery = 'SELECT DISTINCT gu_idx FROM Gu';
          let guResult = await db.queryParam_Arr(guQuery, [gu_idx]);

          if(!guResult){
              res.status(500).send({
                  message : "Server"
              });
          } else { 
              res.status(200).send({
                  message  : "Ok"
              });
          }
      }
  })
});


router.get('/:gu_idx', async(req,res) =>{
  let gu_idx = req.body.gu_idx;

  if(!gu_idx){
      res.status(400).send({
          message : " NULL Value"
      });
  }else { 
      let getFrcListQuery = 'SELECT * FROM eco.franchise WHERE frc_idx = ? '
      let getFrcListResult = await db.queryParam_Arr(getFrcListQuery,[getFrcListResult[0].gu_idx]);

      if(!getFrcListResult){
          res.status(500).send({
              message :  "Server Error"
          });
      }else{
          res.status(200).send({
              message : "ok",
              data : [{frc_list : getFrcListResult}]
          });
      }
  }
})

module.exports = router;