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

router.post('/', async (req, res) => {
    let org_idx = req.body.org_idx;
    let org_name = req.body.org_name;
    let user_idx = req.body.user_idx;
    let donation_mileage = parseInt(req.body.donation_mileage);
    let mileage_date = moment().format('YYYY-MM-DD');

    if (!org_idx || !user_idx || !donation_mileage) {
        res.status(400).send({
            status : "false",
            message : "Null Value"
        });
    } else {
        let selectOwnMileageQuery = 'SELECT user_mileage FROM User WHERE user_idx = ?';
        let selectOwnMileageResult = await db.queryParam_Arr(selectOwnMileageQuery, [user_idx]);

        let user_mileage = parseInt(selectOwnMileageResult[0].user_mileage);
        console.log("user_mileage : " + user_mileage);

        if (user_mileage < donation_mileage) {
            res.status(400).send({
                message : "The user's mileage is insufficient"
            });
        } else {
            let new_user_mileage = user_mileage - donation_mileage;
            let mileage_usage = org_name + "에 " + donation_mileage + " 기부";

            let insertMileageUsageQuery = 'INSERT INTO Mileage (user_idx, mileage_withdraw, mileage_date, mileage_usage, org_idx) VALUES ( ?, ?, ?, ?, ?)';
            let insertMileageUsageResult = await db.queryParam_Arr(insertMileageUsageQuery, [user_idx, donation_mileage, mileage_date, mileage_usage, org_idx]);

            let updateUserInfoQuery = 'UPDATE User SET user_mileage = ? WHERE user_idx = ?';
            let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [new_user_mileage, user_idx]);

            if (!insertMileageUsageResult || !updateUserInfoResult) {
                res.status(500).send({
                    message : "Invaild Server Error"
                });
            } else {
                res.status(200).send({
                    message : "Successfully Donate and Update Mileage"
                });
            }
        }
    }
});


module.exports = router;