const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!user_idx) {
        res.status(400).send( {
            message : "Null Value : user index"
        });
    } else {
        let selectUserQuery = 'SELECT user_idx, user_mileage, user_money FROM User WHERE user_idx = ?';
        let selectUserResult = await db.queryParam_Arr(selectUserQuery, [user_idx]);

        if (!selectUserResult) {
            res.status(500).send({
                message : "Internal Server Error : select user"
            });
        } else {
            res.status(200).send({
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
            message : "Null Value"
        });
    } else {
        user_idx = parseInt(user_idx);
        eco_value = parseInt(eco_value);

        console.log("idx : " + user_idx + ", value : " + eco_value);
        let selectMileageQuery = "";

        if (eco_value == 0) {
            selectMileageQuery = 'SELECT * FROM Mileage WHERE user_idx = ? ORDER BY mileage_date DESC';
        } else {
            selectMileageQuery = 'SELECT * FROM Money WHERE user_idx = ? ORDER BY money_date DESC';
        }

        let selectMileageResult = await db.queryParam_Arr(selectMileageQuery, [user_idx]);

        if (!selectMileageResult) {
            res.status(500).send({
                message : "Internal Server Error : Select Usage"
            });
        } else {
            let used_milage = 0;

            if (eco_value == 0) {
                for (let i = 0; i < selectMileageResult.length; i++) {
                    if (selectMileageResult[i].mileage_withdraw != null) {
                        used_milage += selectMileageResult[i].mileage_withdraw;
                    }
                }
            } else {
                for (let i = 0; i < selectMileageResult.length; i++) {
                    if (selectMileageResult[i].money_withdraw != null) {
                        used_milage += selectMileageResult[i].money_withdraw;
                    }
                }
            }

            res.status(200).send({
                message : "Successfully Get Data",
                milage_total_usage : selectMileageResult,
                used_milage : used_milage
            });
        }

    }
});


module.exports = router;
