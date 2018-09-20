var express = require('express');
var router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');
const calc = require('../../module/calc.js');

//메인화면에서 절약 정보 뿌려주기
router.get('/:user_idx', async (req, res) => {
    let user_idx  = req.params.user_idx;

    let toady_year = parseInt(moment().format('YYYY'));
    let today_month = parstInt(moment().format('MM'));
    let standard_month = today_month - 1;   //이전달의 사용량을 기준으로 하기 때문에

    if (!user_idx) {
        res.status(400).send({
            status : "false",
            message : "Null Value : User Index"
        });
    } else {
        let selectPastQuery = 'SELECT * FROM Usage WHERE user_idx = ? and use_year = ? and use_month = ?';
        let selectPastResult = await db.queryParam_Arr(selectPastQuery, [user_idx, toady_year - 1, standard_month]);

        let selectPresentQuery = 'SELECT * FROM Usage WHERE user_ids = ? and use_year = ? and use_month = ?';
        let selectPresentResult = await db.queryParam_Arr(selectPresentQuery, [user_idx, toady_year, standard_month]);

        if (!selectPastResult || !selectPresentResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : Select Error"
            });
        } else {
            let past = selectPastResult[0].use_elec;
            let present = selectPresentResult[0].use_elec;
            let resultData = new Object();

            resultData.elec = await calc.percentage(past, present);

            past = selectPastResult[0].use_water;
            present = selectPresentResult[0].use_water;

            resultData.water = await calc.percentage(past, present);

            past = selectPastResult[0].use_gas;
            present = selectPresentResult[0].use_gas;

            resultData.gas = await calc.percentage(past, present);

            //기간별 탄소 배출량 구하기
            let selectJoinDateQuery = 'SELECT user_join_date FROM User WHERE user_idx = ?';
            let selectJoinDateResult = await db.queryParam_Arr(selectJoinDateQuery, [user_idx]);

            let user_join_date = selectJoinDateResult[0].user_join_date;    //사용자가 가입한 달

            let max_month = user_join_date + 6;
            if (max_month > 12) {
                max_month -= 12;
            }

            let selectMonthQuery = "";
            let selectMonthResult = "";
            let totalCarbonResult = new Array();

            // if (user_join_date <= max_month <= 12) {
            //     if (user_join_date <= standard_month < max_month) {
            //         let size = 0;
            //         for (let i = user_join_date; i < standard_month; i++) {
            //             selectMonthQuery = 'SELECT use_carbon FROM Usage WHERE user_idx = ? and use_month = ?';
            //             selectMonthResult = await db.queryParam_Arr(selectMonthQuery, [user_idx, i]);

            //             totalCarbonResult[size++] = selectMonthResult.use_carbon;
            //         }
            //     } else if (max_month <= standard_month || standard_month < user_join_date) {
                    
            //     }

            // } else {
            //     if ((user_join_date <= standard_month) || (standard_month < max_month)) {

            //     } else if (max_month <= standard_month < user_join_date) {

            //     }
            // } 

            //바토드와 보유 마일리지 보여주기
            let selectUserInfoQuery = 'SELECT user_barcodenum, user_milage FROM User WHERE user_idx = ?';
            let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [user_idx]);

            







        }
    }

});

module.exports = router;
