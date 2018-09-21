const exxpres = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:frc_idx',async(req,res)=> {
    let frc_idx = req.params.frc_idx;
    let selectFrcQuery = 'SELECT frc_idx FROM franchise WHERE frc_idx = ?'
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
})


module.exprts = router;