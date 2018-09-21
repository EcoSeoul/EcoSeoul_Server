const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');



router.get('/:board_idx',async(req, res)=> {
    let board_idx = req.params.board_idx;


    if(!board_idx){
        res.status(400).send({
            message : "NULL VALUE"
        });
    }else{
       // let getContentQuery = 'SELECT DISTINCT board_idx, board_title, board_content,board_date, (SELECT count(like_idx) FROM Thumb WHERE Board.board_idx = Thumb.board_idx ) as King,(SELECT  count(comment_idx) FROM Comment WHERE Board.board_idx = Comment.board_idx) as Cntcount '
    }

})