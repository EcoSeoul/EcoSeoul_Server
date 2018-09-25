const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');


router.post('/',async(req, res)=> {
    let user_idx = req.body.user_idx;
    let board_idx = req.body.board_idx;

    if(!board_idx || !user_idx){
        res.status(400).send({
            message : "NUll value"
        });
    }else{
        let deleteQuery = `DELETE FROM eco.Board WHERE board_idx =? and user_idx = ?`
        let deleteResult = await db.queryParam_Arr(deleteQuery,[board_idx,user_idx]);

        if(!deleteResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else{
            res.status(201).send({
                message : "OK"
            });
        }
    }
});

module.exports = router;