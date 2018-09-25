const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

router.post('/', async (req, res)=> {
    let user_idx = req.body.user_idx;
    let cmt_idx =req.body.cmt_idx;
    let board_idx = req.body.board_idx;

    if(!cmt_idx|| !user_idx || !board_idx){
        res.status(400).send({
            message : "Null value"
        });
    }else{
        let deleteQuery = `DELETE FROM eco.Comment WHERE cmt_idx =?  and user_idx = ?`
        let deleteResult = await db.queryParam_Arr(deleteQuery,[cmt_idx, user_idx]);
        
        if(!deleteResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else{
            let lQuery = `UPDATE eco.Board SET board_cmtnum = board_cmtnum-1 WHERE board_idx =?`;
            let lResult = await db.queryParam_Arr(lQuery,[board_idx]);
            if(!Result){
                res.status(500).send({
                    message : "cmt sub  SERVER ERR"
                })
            }else{
            res.status(201).send({
                message : "OK"
            });
        }
    }
    }
})

module.exports = router;