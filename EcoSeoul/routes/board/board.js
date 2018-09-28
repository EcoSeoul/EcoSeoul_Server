const express = require('express');
const router = express.Router(); 
const db = require('../../module/pool.js');
const moment = require('moment');

//게시글 상세보기
router.get('/:board_idx/:user_idx', async(req, res)=> {
    let board_idx = req.params.board_idx;
    let user_idx = parseInt(req.params.user_idx);

    if(!board_idx){
        res.status(400).send({
            message : "NULL VALUE"
        });
    }else{
      let boardContentQuery = `SELECT b.*, u.user_ID FROM eco.Board as b JOIN eco.User as u ON b.user_idx = u.user_idx WHERE board_idx = ?`;
      let boardContentResult = await db.queryParam_Arr(boardContentQuery,[board_idx]);

      let commentQuery = `SELECT c.*, u.user_ID FROM eco.Comment as c JOIN eco.User as u ON c.user_idx = u.user_idx WHERE c.board_idx = ?`;
      let commentResult = await db.queryParam_Arr(commentQuery,[board_idx]);

      if (boardContentResult[0].user_idx == user_idx) {
          boardContentResult[0].writer_check = true;
      } else {
        boardContentResult[0].writer_check = false;
      }    

      for (let i = 0; i < commentResult.length; i++) {
        if (commentResult[i].user_idx == user_idx) {
            commentResult[i].writer_check = true;
        } else {
            commentResult[i].writer_check = false;
        }
    }

      if(!boardContentResult || !commentResult){
          res.status(500).send({
              message : "Server Error"
          });
      }else{
          res.status(200).send({
              message : "Success",
              board_Result: boardContentResult,
              comment_Result : commentResult
          });
      }
    }

});

//게시글 작성
router.post('/', async(req, res)=> {
    let board_title = req.body.board_title;
    let board_content = req.body.board_content;
    let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let user_idx = req.body.user_idx;
    

    if(!user_idx){
        res.status(400).send({
            message : "NUll value"
        });
    }else{
        let requestQuery = 'INSERT INTO eco.Board (board_title, board_content,board_date,user_idx) VALUES (?,?,?,?)'
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

//게시글 수정
router.put('/',async(req, res)=>{
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

//게시글 삭제
router.delete('/',async(req, res)=> {
    let user_idx = req.body.user_idx;
    let board_idx = req.body.board_idx;

    if(!board_idx || !user_idx){
        res.status(400).send({
            message : "NUll value"
        });
    }else{
        let deleteQuery = `DELETE FROM eco.Board WHERE board_idx =? and user_idx = ?`
        let deleteResult = await db.queryParam_Arr(deleteQuery,[board_idx,user_idx]);

        if(!deleteResult){
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