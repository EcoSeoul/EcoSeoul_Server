const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');

router.get('/:gu_idx', async(req,res) =>{
  let gu_idx = req.params.gu_idx;

  if(!gu_idx){
      res.status(400).send({
          message : " NULL Value"
      });
  }else { 
      let getFrcListQuery = 'SELECT frc_idx, gu_idx, frc_lat, frc_long FROM eco.franchise WHERE gu_idx = ? '
      let getFrcListResult = await db.queryParam_Arr(getFrcListQuery, [gu_idx]);

      if(!getFrcListResult){
          res.status(500).send({
              message :  "Server Error"
          });
      }else{
          res.status(200).send({
              message : "ok",
              data : getFrcListResult
          });
      }
  }
});

router.get('/detail/:frc_idx',async(req,res)=> {
    let frc_idx = req.params.frc_idx;
    let selectFrcQuery = 'SELECT * FROM eco.franchise WHERE frc_idx = ?'
    let selectFrcResult = await db.queryParam_Arr(selectFrcQuery, [frc_idx]);

    if(!selectFrcResult){
        res.status(500).send({
            message : "Server ERRoR"
        });
    }else{
        res.status(200).send({
            message : "OK",
            data : [{frc_information : selectFrcResult}]
        });
    }
});

module.exports = router;