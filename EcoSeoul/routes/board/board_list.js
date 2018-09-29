const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const moment = require('moment');


router.get('/', async(req, res)=>{
    let viewQuery = `SELECT DISTINCT Board.board_idx,Board.board_title,Board.board_content,DATE_FORMAT(Board.board_date,'%y/%m/%d')as board_date,Board.user_idx,Board.board_like, 
    Board.board_cmtnum, (SELECT User.user_name FROM eco.User WHERE user_idx = Board.user_idx) as User_name FROM eco.Board, eco.User  ORDER BY Board.board_idx DESC;`
    let viewResult = await db.queryParam_None(viewQuery);
    let bestQuery = `SELECT DISTINCT Board.board_idx,Board.board_title,Board.board_content,DATE_FORMAT(Board.board_date,'%y/%m/%d')as board_date,Board.user_idx,Board.board_like, Board.board_cmtnum, (SELECT User.user_name FROM eco.User WHERE user_idx = Board.user_idx) as User_name FROM eco.Board, eco.User  ORDER BY Board.board_like DESC limit 3;`
    let bestResult = await db.queryParam_None(bestQuery);

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