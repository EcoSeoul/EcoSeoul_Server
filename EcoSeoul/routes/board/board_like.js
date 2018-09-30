const express = require('express');
const router = express.Router(); 
const db = require('../../module/pool.js');


router.post('/',async(req, res)=>{
    let board_idx = req.body.board_idx;
    let user_idx = req.body.user_idx;

    if(!board_idx || !user_idx){
        res.status(400).send({
            message : "Null value"
        });
    }else{
        let selectLikeQuery = `SELECT * FROM eco.Thumb where board_idx = ?  and user_idx =?`
        let selectLikeResult = await db.queryParam_Arr( selectLikeQuery, [board_idx, user_idx]);
        
        if(!selectLikeResult){
            res.status(500).send({
                message : "Server Error"
            });
        }else{
            if (selectLikeResult.length >= 1) {
                let deleteThumbQuery = 'DELETE FROM eco.Thumb WHERE board_idx = ? AND user_idx = ?;';
                let deleteThumbResult = await db.queryParam_Arr(deleteThumbQuery, [board_idx, user_idx]);

                if (!deleteThumbResult) {
                    res.status(500).send({
                        message : "Internal Server Error : Delete Thumb"
                    });
                } else {
                    let cntLikeQuery = 'SELECT count(t.like_idx) likes FROM eco.Thumb AS t WHERE board_idx = ?;';
                    let cntLikeResult = await db.queryParam_Arr(cntLikeQuery, [board_idx]);
    
                    let updateBoardLikeQuery = 'UPDATE eco.Board SET board_like = ? WHERE board_idx = ?';
                    let updateBoardLikeResult = await db.queryParam_Arr(updateBoardLikeQuery, [cntLikeResult[0].likes, board_idx]);

                    if (!updateBoardLikeResult) {
                        res.status(500).send({
                            message : "Internal Server Error : Update Board Like Cnt"
                        });
                    } else {
                        res.status(200).send({
                            message : "Successfully Delete Thumb"
                        });
                    }
                }
            } else {
                let addThumbQuery = 'INSERT INTO eco.Thumb VALUES (null, 1, ?, ?);';
                let addThumbResult = await db.queryParam_Arr(addThumbQuery, [user_idx, board_idx]);
                
                if (!addThumbResult) {
                    res.status(500).send({
                        message : "Internal Server Error : Add Thumb"
                    });
                } else {
                    let cntLikeQuery = 'SELECT count(t.like_idx) likes FROM eco.Thumb AS t WHERE board_idx = ?;';
                    let cntLikeResult = await db.queryParam_Arr(cntLikeQuery, [board_idx]);
    
                    let updateBoardLikeQuery = 'UPDATE eco.Board SET board_like = ? WHERE board_idx = ?';
                    let updateBoardLikeResult = await db.queryParam_Arr(updateBoardLikeQuery, [cntLikeResult[0].likes, board_idx]);

                    if (!updateBoardLikeResult) {
                        res.status(500).send({
                            message : "Internal Server Error : Update Board Like Cnt"
                        });
                    } else {
                        res.status(200).send({
                            message : "Successfully Add Thumb"
                        });
                    }
                }
            }
        }
    }
});


module.exports = router;