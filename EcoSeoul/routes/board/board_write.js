const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');  
const db = require('../../module/pool.js');
const moment = require('moment');



router.post('/', async(req, res)=> {
    let board_title = req.body.board_title;
    let boaard_content = req.body.boaard_content;
    let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let user_idx = req.body.userIdx;
    

    if(!user_idx){
        res.status(400).send({
            message : "NUll value"
        });
    }else{
        let requestQuery = 'INSERT INTO Board (board_title, board_content,board_date,user_idx) VALUES (?,?,?,?)'
        let requestResult = await db.queryParam_Arr(requestQuery, [board_title,board_content,currentTime,user_idx]);
    
    if(!requestResult){
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