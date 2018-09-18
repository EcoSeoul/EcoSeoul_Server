const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!user_idx) {
        res.status(400).send( {
            status : "false",
            message : "Null Value : user index"
        });
    } else {
        let selectUserQuery = 'SELECT user_idx, user_milage, user_money FROM user WHERE user_idx = ?';
        let selectUserResult = await db.queryParam_Arr(selectUserQuery, [user_idx]);

        if (!selectUserResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : select user"
            });
        } else {
            res.status(200).send({
                status : "true",
                message : "Successfully select data",
                result : selectUserResult
            });
        }
    }
});

router.get('/usage/:user_idx/:eco_value', async (req, res) => {
    let user_idx = req.params.user_idx;
    let eco_value = req.params.eco_value;

    if (!user_idx || !eco_value) {
        res.status(400).send({
            status : "false",
            message : "Null Value"
        });
    } else {
        let selectUsageQuery = "";
        let seleceUsageResult = "";

        if (eco_value == 0) {
            selectUsageQuery = 'SELECT * FROM Milage WHERE user_idx = ?';
            selectUsageResult = await db.queryParam_Arr(selectUsageQuery, [user_idx]);
        } else {
            selectUsageQuery = 'SELECT * FROM Money WHERE user_idx = ?';
            selectUsageResult = await db.queryParam_Arr(selectUsageQuery, [user_idx]);
        }

        if (!seleceUsageResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : Select Usage"
            });
        } else {
            let used_milage = 0;

            if (eco_value == 0) {
                for (let i = 0; i < selectMilageResult.length; i++) {
                    if (selectMilageResult[i].mileage_withdraw != null) {
                        used_milage += selectMilageResult[i].mileage_withdraw;
                    }
                }
            } else {
                for (let i = 0; i < selectMilageResult.length; i++) {
                    if (selectMilageResult[i].money_withdraw != null) {
                        used_milage += selectMilageResult[i].money_withdraw;
                    }
                }
            }

            res.status(200).send({
                status : "true",
                message : "Successfully Get Data",
                milage_total_usage : selectUsageResult,
                used_milage : used_milage
            });
        }

    }
});


module.exports = router;
