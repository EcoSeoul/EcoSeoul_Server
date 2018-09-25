const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');

router.get('/', async(req, res) => {
    let guQuery = 'SELECT DISTINCT * FROM eco.Gu';
    let guResult = await db.queryParam_None(guQuery);

    if(!guResult){
        res.status(500).send({
            message : "Internal Server Server"
        });
    } else {
        res.status(200).send({
            message  : "Ok",
            gu_Result :  guResult
        });
    }
});


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
})

module.exports = router;