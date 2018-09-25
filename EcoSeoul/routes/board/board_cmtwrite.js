const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');  
const db = require('../../module/pool.js');
const moment = require('moment');


router.post('/',async(req, res)=>{

    let cmt_date = moment().format('YYYY-MM-DD HH:mm:ss');
    let user_idx = req.body.user_idx;
    let cmt_content = req.body.cmt_content;
    let board_idx = req.body.board_idx;

    if((user_idx == null) || (board_idx == null)){
        res.status(400).send({
            message : "Null value"
        });
    }else {
        let registerQuery  = 'INSERT INTO eco.Comment (cmt_date,cmt_content,user_idx,board_idx) VALUES (?,?,?,?)';
        let registerResult = await db.queryParam_Arr(registerQuery,[cmt_date,cmt_content,user_idx,board_idx]);
        console.log(user_idx, board_idx, cmt_content,cmt_date);
        if(!registerResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else {
            let addQuery = `UPDATE eco.Board SET board_cmtnum = board_cmtnum+1 WHERE board_idx = ?`;
            let addResult = await db.queryParam_Arr(addQuery,[board_idx]);
            if(!addResult){
                res.status(500).send({
                    message : "cmtnum add Server Error"
                });
            }else{
            res.status(201).send({
                message : " OK",
            });
        }
    }

    }

})

module.exports = router;