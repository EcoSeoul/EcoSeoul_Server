var express = require('express');
var router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');

router.get('/', async (req, res) => {
    let selectOrgQuery = 'SELECT * FROM Organization';
    let selectOrgResult = await db.queryParam_None(selectOrgQuery);

    if (!selectOrgResult) {
        res.status(500).send({
            status : "false",
            message : "Invaild Server Error : select Org Error"
        });
    } else {
        res.status(200).send({
            status : "true",
            message : "Successfully Get Data",
            orgData : selectOrgResult
        });
    }
});

router.post('/', async (rea, res) => {
    let org_idx = req.body.org_idx;
    let user_idx = req.body.user_idx;
    let donation_milage = req.body.donation_milage;
    let milage_date = moment().format('YYYY-MM-DD');

    if (!org_idx || !user_idx || !donation_milage) {
        res.status(400).send({
            status : "false",
            message : "Null Value"
        });
    } else {
        let selectOwnMilageQuery = 'SELECT user_milage FROM User WHERE user_idx = ?';
        let selectOwnMilageResult = await db.queryParam_Arr(selectOwnMilageQuery, [user_idx]);

        let user_milage = parseInt(selectOwnMilageResult[0].user_milage);

        if (user_milage < donation_milage) {
            res.status(400).send({
                message : "The user's mileage is insufficient"
            });
        } else {
            let new_user_milage = user_milage - donation_milage;

            let insertMilageUsageQuery = 'INSERT INTO Milage (user_idx, milage_withdraw, milage_date, milage_usage, org_idx) VALUES ( ?, ?, ?, ?, ?)';
            let insertMilageUsageResult = await db.queryParam_Arr(insertMilageUsageQuery, (user_idx, donation_milage, milage_date, donation_milage, org_idx));

            let updateUserInfoQuery = 'UPDATE User SET user_milage = ? WHERE user_idx = ?';
            let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [new_user_milage, user_idx]);

            if (!insertMilageUsageResult || !updateUserInfoResult) {
                res.status(500).send({
                    message : "Invaild Server Error"
                });
            } else {
                res.status(200).send({
                    message : "Successfully Donate and Update Milage"
                });
            }
        }
    }
});


module.exports = router;