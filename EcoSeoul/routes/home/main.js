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
    let today = (toady_year - 2000) * 12 + today_month;
    let past = (toady_year - 1 - 2000) * 12 + today_month;
    let standard_month = today - 1;   //이전달의 사용량을 기준으로 하기 때문에

    if (!user_idx) {
        res.status(400).send({
            status : "false",
            message : "Null Value : User Index"
        });
    } else {
        let selectPastQuery = 'SELECT * FROM Usage WHERE user_idx = ? and use_month_int = ?';
        let selectPastResult = await db.queryParam_Arr(selectPastQuery, [user_idx, standard_month]);

        let selectPresentQuery = 'SELECT * FROM Usage WHERE user_ids = ? and use_month_int = ?';
        let selectPresentResult = await db.queryParam_Arr(selectPresentQuery, [user_idx, standard_month]);

        if (!selectPastResult || !selectPresentResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : Select Error"
            });
        } else {
            let pastData = selectPastResult[0].use_elec;
            let presentData = selectPresentResult[0].use_elec;
            let usageData = new Object();

            usageData.elec = await calc.percentage(pastData, presentData);

            pastData = selectPastResult[0].use_water;
            presentData = selectPresentResult[0].use_water;

            usageData.water = await calc.percentage(pastData, presentData);

            pastData = selectPastResult[0].use_gas;
            presentData = selectPresentResult[0].use_gas;

            usageData.gas = await calc.percentage(pastData, presentData);

            //기간별 탄소 배출량 구하기
            let selectJoinDateQuery = 'SELECT user_join_date FROM User WHERE user_idx = ?';
            let selectJoinDateResult = await db.queryParam_Arr(selectJoinDateQuery, [user_idx]);

            let user_join_date = selectJoinDateResult[0].user_join_date;    //사용자가 가입한 달

            let max_month = user_join_date + 6;
            if (max_month > 12) {
                max_month -= 12;
            }

            let min = user_join_date;
            let max = max_month;

            if (user_join_date > max_month) {
                min = max_month;
                max = user_join_date;
            }

            
            let totalCarbonResult = new Array();
            let pastTotalCarbonResult = new Array();
            let totalCarbon = 0;
            let pastTotalCarbon = 0;
            let i = 0;
            let j = 0;
            let pastMax = 0;    //전영도 구할 때 반복문을 어디까지 돌릴지
            let term = new Array();

            if (standard_month < min) {
                i = ((toady_year - 1) - 2000) * 12 + max;
                j = ((toady_year - 2) - 2000) * 12 + max;
                term[0] = max;
                term[1] = min;
                pastMax = min;
            } else if (min < standard_month < max) {
                i = (toady_year - 2000) * 12 + min;
                j = ((toady_year - 1) - 2000) * 12 + max;
                term[0] = min;
                term[1] = max;
                pastMax = max;
            } else {
                i = 0;
                j = 0;
            }

            console.log("falg_month_int" + i);

            for (; i < today; i++) {
                let selectMonthQuery = 'SELECT use_month_int, use_carbon FROM Usage WHERE user_idx = ? and user_month_int = ? ORDER BY use_month_int ASC';
                let selectMonthResult = await db.queryParam_Arr(selectMonthQuery, [user_idx, i]);

                totalCarbon += parseInt(selectMonthResult[0].use_carbon);
                totalCarbonResult.add(selectMonthResult);                   
            }

            for (; j <= pastMax; j++) {
                let selectMonthQuery = 'SELECT use_month_int, use_carbon FROM Usage WHERE user_idx = ? and user_month_int = ? ORDER BY use_month_int ASC';
                let selectMonthResult = await db.queryParam_Arr(selectMonthQuery, [user_idx, j]);

                if (j <= past) {
                    pastTotalCarbon += parseInt(selectMonthResult[0].use_carbon);
                }
                
                pastTotalCarbonResult.add(selectMonthResult); 
            }

            usageData.carbon = await calc.percentage(totalCarbon, pastTotalCarbon);

            //바코드와 보유 마일리지 보여주기
            let selectUserInfoQuery = 'SELECT user_barcodenum, user_milage FROM User WHERE user_idx = ?';
            let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [user_idx]);

            if (!totalCarbonResult || selectUserInfoResult) {
                res.status(500).send({
                    message : "Invail Server Error : Get Data"
                });
            } else {
                res.status(200).send({
                    term : term,
                    carbon : totalCarbonResult,
                    totalCarbon : totalCarbon,
                    pastTotalCarbon : pastTotalCarbon,
                    usageData : usageData,
                    userInfo : selectUserInfoResult,
                    message : "Successfully Get Data"
                });
            }
        }
    }

});

module.exports = router;
