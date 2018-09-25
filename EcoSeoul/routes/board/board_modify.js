const express= require('express');
const router = express.Router();

const db = require('../../module/pool.js');


router.post('/',async(req, res)=>{
    let user_idx = req.body.user_idx;
    let board_idx = req.body.board_idx;
    let selectboardQuery = 'SELECT user_idx FROM eco.Board WHERE user_idx = ?'
    let selectboardResult = await db.queryParam_Arr(selectboardQuery,[user_idx]);

    if(!selectboardResult){
        res.status(500).send({
            message : "Server error"
        });
    }else{
        let boardCheckQuery = 'SELECT board_idx FROM eco.Board WHERE board_idx = ?'
        let boardCheckResult = await db.queryParam_Arr(boardCheckQuery,[board_idx]);
        if(!boardCheckResult){
            res.status(400).send({
                message : " null value"
            });
        }else{
            let board_title = req.body.board_title;
            let board_content = req.body.board_content;
            let updateQuery = `UPDATE eco.Board SET board_title = ?, board_content = ? WHERE board_idx = ?`
            let updateResult = await db.queryParam_Arr(updateQuery,[board_title, board_content, board_idx]);

            if(!board_title || !board_content){
                res.status(400).send({
                    message : "null value"
                });
            }else{
                if(!updateResult){
                    res.status(500).send({
                        message : "SERver error"
                    });
                }else{
                    res.status(201).send({
                        message : "OK"
                    });
                }
            }
        }
    }

});

module.exports = router;