const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    if (!user_id || !user_pw) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let checkUserQuery = 'SELECT * FROM User WHERE user_ID = ?';
        let checkResult = await db.queryParam_Arr(checkUserQuery, [user_id]);

        if (!checkResult) {
            res.status(500).send( {
                message : "Internal Server Error"
            })
        } else if (checkResult.length == 1) {
            res.status(201).send({
                message : "Login Success",
                checkResult : checkResult
            });
    
        } else {
            console.log("id error");
            res.status(400).send( {
                message : "Login Failed : Id error"
            });
        }
    }
});




module.exports = router;
