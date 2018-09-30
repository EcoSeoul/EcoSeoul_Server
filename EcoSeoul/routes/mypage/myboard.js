const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');


router.get('/:user_idx',async(req, res)=> {
    let user_idx = req.params.user_idx;

    if(!user_idx){
        res.status(400).send({
            message : " Null Value"
        });
    }else{
        let getmytextQuery = `SELECT DISTINCT Board.board_idx,Board.board_title,Board.board_content,
        DATE_FORMAT(Board.board_date,'%y/%m/%d') as board_date,Board.user_idx,Board.board_like, User.user_name,Board.board_cmtnum FROM eco.Board, eco.User WHERE User.user_idx = Board.user_idx and User.user_idx = ? ORDER BY Board.board_idx DESC;`;
        let getmytextList = await db.queryParam_Arr(getmytextQuery,[user_idx]);


        for(let i=0;i<getmytextList.length;i++){
            let selectLikeFlagQuery = 'SELECT like_flag FROM eco.Thumb WHERE board_idx = ? AND user_idx = ?';
            let selectLikeFlagResult = await db.queryParam_Arr(selectLikeFlagQuery, [getmytextList[i].board_idx, user_idx]);

        if (selectLikeFlagResult.length == 0) {
            getmytextList[i].likeFlag = false;
        } else {
            if (selectLikeFlagResult[0].like_flag == 1) {
                getmytextList[i].likeFlag = true;
            }
        }
    }
        if(!getmytextList){
            res.status(500).send({
                message : "Server error"
            });
        }else{
            res.status(200).send({
                message : "ok",
                mytext_list : getmytextList
            });
        }
    }
});

module.exports = router;