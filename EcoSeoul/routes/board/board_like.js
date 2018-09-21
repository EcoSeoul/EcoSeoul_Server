const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');  
const db = require('../../module/pool.js');


router.post('/',async(req, res)=>{

    let board_idx = req.body.board_idx;
    let user_idx = req.body.user_idx;

    if(!board_idx || !user_idx){
        res.status(400).send({
            message : "Null value"
        });
    }else{
        let likenum = `SELECT like_flag FROM eco.Thumb where board_idx = ?  and user_idx =?`
        let likeResult = await db.queryParam_Arr(likenum,[board_idx,user_idx]);
        if(!likeResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else{
            if(likeResult == 0 ){
                let insertQuery = `INSERTINTO eco.Thumb (board_idx,user_idx,like_flag) VALUES (?,?,1)`;
                let insertResult = await db.queryParam_Arr(insertQuery,[board_idx, user_idx]);


                let mQuery = `UPDATE Board SET board_like = board_like+1 WHERE board_idx= ?`;
                let mReuslt = await db.queryParam_Arr(mQuery,[board_idx]);

                if(!insertResult || !mReuslt){
                    res.status(500).send({
                        message : "server Err"
                    });
                }else{
                    res.status(201).send({
                        message : "ok",
                        flag : "1"
                    });
                }
            }
            else if(likeResult[0].like_flag ==1){
                let mQuery = `UPDATE Board SET board_like = board_like-1 WHERE board_idx =?`;
                let mReuslt = await db.queryParam_Arr(mQuery,[board_idx]);


                let lQuery = `DELETE FROM eco.Thumb WHERE board_idx = ? and user_idx =?`;
                let lResult = await db.queryParam_Arr(lQuery,[board_idx,user_idx]);

                if(!mReuslt || !lResult){
                    res.status(500).send({
                        message : "server ERRor!"
                    });
                }else{
                    res.status(201).send({
                        message : "ok",
                        flag :"0"
                    });
                }
            }
        }
    }
});


module.exports = router;