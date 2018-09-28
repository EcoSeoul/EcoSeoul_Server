const express = require('express');
const router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');

router.post('/', async (req, res) =>{
   let user_idx = req.body.user_idx;
   let exchange = parseInt(req.body.exchange);

   if (!user_idx || !exchange) {
       res.status(400).send({
           message : "Null Value : user index and how much"
       });
   } else {
       //에코 마일리지 -> 에코 머니 환전 비율은???
       let selectUserQuery = 'SELECT user_mileage, user_money FROM User WHERE user_idx = ?';
       let selectUserResult = await db.queryParam_Arr(selectUserQuery, [user_idx]);

       let user_mileage = selectUserResult[0].user_mileage;
       let user_money = selectUserResult[0].user_money;

       console.log("mileage : " + user_mileage + " / money : " + user_money);

       if (user_mileage < 20000) {
           res.status(400).send({
               message : "You can exchange money only if you have more than 20,000 points in mileage."
           });
       } else if (user_mileage < exchange) {
            res.status(400).send({
                message : "Insufficient miles to switch"
            });
       } else if (exchange < 1000) {
            res.status(400).send({
                message : "The minimum exchange amount is 1000"
            });
       } else {
           let mileage_date = moment().format('YYYY-MM-DD');
           let mileage_usage = "에코마일리지 " + exchange + "원 에코머니로 전환";

           let insertMileageUsageQuery = 'INSERT INTO Mileage (user_idx, mileage_withdraw, mileage_date, mileage_usage) VALUES ( ?, ?, ?, ?)';
           let insertMileageUsageResult = await db.queryParam_Arr(insertMileageUsageQuery, [user_idx, exchange, mileage_date, mileage_usage]);

           let insertMoneyUsageQuery = 'INSERT INTO Money (user_idx, money_deposit, money_date, money_usage) VALUES ( ?, ?, ?, ?)';
           let insertMoneyUsageResult = await db.queryParam_Arr(insertMoneyUsageQuery, [user_idx, exchange, mileage_date, mileage_usage]);

           if (!insertMileageUsageResult || !insertMoneyUsageResult) {
               res.status(500).send( {
                   message : "Invaild Server Error : Insert Error"
               });
           } else {
               let updateUserInfoQuery = 'UPDATE User SET user_mileage = ?, user_money = ? WHERE user_idx = ?';
               let updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [user_mileage - exchange, user_money + exchange, user_idx]);

               if (!updateUserInfoResult) {
                   res.status(500).send({
                       message : "Invail Server Error : Update User Info"
                   });
               } else {
                   res.status(200).send({
                       message : "Successfully Exchange Mileage to Money"
                   });
               }
           }           
       }
   }
});


module.exports = router;
