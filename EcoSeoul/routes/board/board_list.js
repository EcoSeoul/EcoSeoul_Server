const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const moment = require('moment');


router.get('/:user_idx', async(req, res)=>{
    let user_idx = req.params.user_idx;

    let viewQuery = `SELECT DISTINCT Board.board_idx,Board.board_title,Board.board_content,DATE_FORMAT(Board.board_date,'%y/%m/%d')as board_date,Board.user_idx,Board.board_like, 
    Board.board_cmtnum, (SELECT User.user_name FROM eco.User WHERE user_idx = Board.user_idx) as User_name FROM eco.Board, eco.User  ORDER BY Board.board_idx DESC;`
    let viewResult = await db.queryParam_None(viewQuery);
    let bestQuery = `SELECT DISTINCT Board.board_idx,Board.board_title,Board.board_content,DATE_FORMAT(Board.board_date,'%y/%m/%d')as board_date,Board.user_idx,Board.board_like, Board.board_cmtnum, (SELECT User.user_name FROM eco.User WHERE user_idx = Board.user_idx) as User_name FROM eco.Board, eco.User  ORDER BY Board.board_like DESC limit 3;`
    let bestResult = await db.queryParam_None(bestQuery);

    for (let i = 0; i < viewResult.length; i++) {
        let selectLikeFlagQuery = 'SELECT like_flag FROM eco.Thumb WHERE board_idx = ? AND user_idx = ?';
        let selectLikeFlagResult = await db.queryParam_Arr(selectLikeFlagQuery, [viewResult[i].board_idx, user_idx]);

        if (selectLikeFlagResult.length == 0) {
            viewResult[i].likeFlag = false;
        } else {
            if (selectLikeFlagResult[0].like_flag == 1) {
                viewResult[i].likeFlag = true;
            }

        }
        
    }

    for (let i = 0; i < bestResult.length; i++) {
        let selectLikeFlagQuery = 'SELECT like_flag FROM eco.Thumb WHERE board_idx = ? AND user_idx = ?';
        let selectLikeFlagResult = await db.queryParam_Arr(selectLikeFlagQuery, [bestResult[i].board_idx, user_idx]);

        if (selectLikeFlagResult.length == 0) {
            bestResult[i].likeFlag = false;
        } else {
            if (selectLikeFlagResult[0].like_flag == 1) {
                bestResult[i].likeFlag = true;
            }

        } 
    }

    if(!viewResult || !bestResult){
        res.status(500).send({
            message : "Server Error"
        });
    }else{
        res.status(200).send({
            message : "OK",
            best_list : bestResult,
            all_list : viewResult
        });
    }
});


module.exports = router;