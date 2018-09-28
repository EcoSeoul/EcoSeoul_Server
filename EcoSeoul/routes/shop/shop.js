const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

router.get('/', async (req, res) => {
    let selectShopQuery = 'SELECT goods_idx, goods_name, goods_img FROM eco.shop';
    let selectShopResult = await db.queryParam_None(selectShopQuery);

    if (!selectShopResult) {
        res.status(500).send({
            message : "Invaild Server Error"
        });
    } else {
        res.status(200).send({
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
        let selectDetailQuery = 'SELECT * FROM eco.shop WHERE goods_idx = ?';
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
    let milage_date = moment().format('YYYY-MM-DD');

    if (!goods_idx || !user_idx) {
        res.status(400).send({
            message : "Null Value : goods and user index"
        });
    } else {
        let selectUserInfoQuery = 'SELECT user_mileage FROM User WHERE user_idx = ?';
        let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [user_idx]);

        let user_mileage = selectUserInfoResult[0].user_mileage;

        if (user_mileage < goods_price) {
            res.status(400).send({
                message : "The user's mileage is insufficient"
            });
        } else {
            let mileage_usage = goods_name + " 구매";
            let new_user_mileage = user_mileage - goods_price;

            let insertMileageUsageQuery = 'INSERT INTO Mileage (user_idx, mileage_withdraw, mileage_date, mileage_usage, goods_idx) VALUES ( ?, ?, ?, ?, ?)';
            let insertMileageUsageResult = await db.queryParam_Arr(insertMileageUsageQuery, [user_idx, goods_price, milage_date, mileage_usage, goods_idx]);

            let updateUserInfoQuery = 'UPDATE User SET user_mileage = ? WHERE user_idx = ?';
            let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [new_user_mileage, user_idx]);

            if (!insertMileageUsageResult || !updateUserInfoResult) {
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
