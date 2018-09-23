const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

router.get('/', async (req, res) => {
    let selectShopQuery = 'SELECT goods_idx, goods_name, goods_img FROM shop';
    let selectShopResult = await db.queryParam_None(selectShopQuery);

    if (!selectShopResult) {
        res.status(500).send({
            status : "false",
            message : "Invaild Server Error"
        });
    } else {
        res.status(200).send({
            status : "true",
            message : "Successfully Get Data",
            shopData : selectShopResult
        });
    }
});

router.get('/:goods_idx', async (req, res) => {
    let goods_idx = req.params.goods_idx;

    if (!goods_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let selectDetailQuery = 'SELECT * FROM shop WHERE goods_idx = ?';
        let selectDetailResult = await db.queryParam_Arr(selectDetailQuery, [goods_idx]);

        if (!selectDetailResult) {

        } else {
            res.status(200).send({
                massage : "Successfully Get Data",
                sohopDetail : selectDetailResult
            });
        }
    }
});

router.post('/', async (req, res) => {
    let goods_idx = req.body.goods_idx;
    let goods_name = req.body.goods_name;
    let goods_price = req.body.goods_price
    let user_idx = req.body.user_idx;
    let time = moment().format('YYYY-MM-DD');

    if (!goods_idx || !user_idx) {
        res.status(400).send({
            message : "Null Value : goods and user index"
        });
    } else {
        let selectUserInfoQuery = 'SELECT user_milage FROM User WHERE user_idx = ?';
        let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [user_idx]);

        let user_milage = selectUserInfoResult[0].user_milage;

        if (user_milage < goods_price) {
            res.status(400).send({
                message : "The user's mileage is insufficient"
            });
        } else {
            let milage_usage = goods_name + " 구매";
            let new_user_milage = user_milage - goods_price;

            let insertMilageUsageQuery = 'INSERT INTO Milage (user_idx, milage_withdraw, milage_date, milage_usage, goods_idx) VALUES ( ?, ?, ?, ?, ?)';
            let insertMilageUsageResult = await db.queryParam_Arr(insertMilageUsageQuery, (user_idx, donation_milage, milage_date, milage_usage, goods_idx));

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
