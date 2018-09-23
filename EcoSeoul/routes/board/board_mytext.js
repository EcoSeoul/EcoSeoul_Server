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
        Board.board_date,Board.user_idx,Board.board_like, User.user_name,Board.board_cmtnum FROM eco.Board, eco.User WHERE User.user_idx = Board.user_idx and User.user_idx = ? ORDER BY Board.board_idx DESC;`;
        let getmytextList = await db.queryParam_Arr(getmytextQuery,[user_idx]);
        if(!getmytextList){
            res.status(500).send({
                message : "Server error"
            });
        }else{
            res.status(200).send({
                message : "ok",
                data : [{mytext_list : getmytextList}]
            });
        }
    }
});

module.exports = router;