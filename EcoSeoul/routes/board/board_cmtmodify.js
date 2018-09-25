const express= require('express');
const router = express.Router();

const db = require('../../module/pool.js');


router.post('/',async(req, res)=> {
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

module.exports = router;