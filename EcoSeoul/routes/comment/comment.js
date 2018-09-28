const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const moment = require('moment');

//댓글 작성
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

        let countCommentQuery = 'SELECT count(c.cmt_idx) cmt_cnt FROM eco.Comment as c WHERE c.board_idx = ?';
        let countCommentResult = await db.queryParam_Arr(countCommentQuery, [board_idx]);

        let updateboardQuery = 'UPDATE eco.Board SET board_cmtnum = ? WHERE board_idx = ?';
        let updateboardResult = await db.queryParam_Arr(updateboardQuery, [countCommentResult[0].cmt_cnt, board_idx]);

        if(!registerResult || !updateboardResult){
            res.status(500).send({
                message : "Server Error"
            });
        } else {
            res.status(200).send({
                message : " OK",
            });
        }
    }

});

//댓글 수정
router.put('/',async(req, res)=> {
    let user_idx = req.body.user_idx;
    let cmt_idx = req.body.cmt_idx;
    let selectcmtQuery = `SELECT user_idx FROM eco.Comment WHERE user_idx = ?`
    let selectcmtResult = await db.queryParam_Arr(selectcmtQuery,[user_idx]);

    if(!selectcmtResult){
        res.status(500).send({
            message : "Server Error"
        });
    }else{
        let cmtCheckQuery = `SELECT cmt_idx FROM eco.Comment WHERE cmt_idx =?`
        let cmtCheckResult = await db.queryParam_Arr(cmtCheckQuery,[cmt_idx]);
        if(!cmtCheckResult){
            res.status(400).send({
                message : "Null value"
            });
        }else{
            let cmt_content = req.body.cmt_content;
            let updateQuery = `UPDATE eco.Comment SET cmt_content =? WHERE cmt_idx =?`
            let updateResult = await db.queryParam_Arr(updateQuery,[cmt_content,cmt_idx]);

            if(!cmt_content){
                res.status(400).send({
                    message : "null value"
                });
            }else{
                if(!updateResult){
                    res.status(500).send({
                        message : "Server Err"
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

//댓글 삭제
router.delete('/', async (req, res)=> {
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
            let countCommentQuery = 'SELECT count(c.cmt_idx) cmt_cnt FROM eco.Comment as c WHERE c.board_idx = ?';
            let countCommentResult = await db.queryParam_Arr(countCommentQuery, [board_idx]);

            let updateboardQuery = 'UPDATE eco.Board SET board_cmtnum = ? WHERE board_idx = ?';
            let updateboardResult = await db.queryParam_Arr(updateboardQuery, [countCommentResult[0].cmt_cnt, board_idx]);

            if(!updateboardResult){
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
});


module.exports = router;