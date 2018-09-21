const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');  
const db = require('../../module/pool.js');
const moment = require('moment');


router.post('/',async(req, res)=>{

    let cmt_date = moment().format('YYYY-MM-DD HH:mm:ss');
    let user_Idx = req.body.user_idx;
    let cmt_content = req.body.cmt_content;
    let board_idx = req.body.board_idx;

    if((user_idx == null) || (board_idx == null)){
        res.status(400).send({
            message : "Null value"
        });
    }else {
        let registerQuery  = 'INSERT INTO (cmt_date,cmt_content,user_idx,board_idx) VALUES (?,?,?,?)';
        let register = await db.queryParam_Arr(registerQuery,[cmt_date,cmt_content,user_Idx,board_idx]);
        let numQuery = `SELECT cmt_idx FROM Comment WHERE user_idx = ? and cmt_content = ? and cmt_idx = ?`
        let numResult = await db.queryParam_Arr(numQuery, [ user_idx,cmt_content,cmt_idx]);
        let addQuery = `UPDATE Board SET board_cmtnum= board_cmtnum+1 WHERE board_idx = ?`;
        let addResult = await db.queryParam_Arr(addQuery,[board_idx]);

        if(!register  || !numResult || !addResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else {
            res.status(201).send({
                message : " OK",
                data : [{cmt_idx: numResult[0].cmt_idx}]
            });
        }

    }

})

module.exports = router;