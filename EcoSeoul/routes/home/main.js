var express = require('express');
var router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');
const calc = require('../../module/calc.js');

//메인화면에서 절약 정보 뿌려주기
router.get('/:user_idx', async (req, res) => {
    let user_idx  = req.params.user_idx;

    let toady_year = parseInt(moment().format('YYYY'));
    let today_month = parseInt(moment().format('MM'));
    console.log("toady year : " + toady_year + " / month : " + today_month);
    let today = (toady_year - 2000) * 12 + today_month;
    let past = (toady_year - 1 - 2000) * 12 + today_month;
    let month_int_today = (toady_year - 2000) * 12 + today_month - 1;
    let month_int_past = (toady_year - 1 - 2000) * 12 + today_month - 1;

    if (!user_idx) {
        res.status(400).send({
            status : "false",
            message : "Null Value : User Index"
        });
    } else {
        user_idx = parseInt(user_idx);
        //console.log("user_idx : " + user_idx + ", today : " + month_int_today + ", past : " + month_int_past);
       
        let selectUsageQuery = 'SELECT * FROM eco.Usage WHERE user_idx = ? AND (use_month_int = ? OR use_month_int = ?) ORDER BY use_month_int ASC';
        let selectUsageResult = await db.queryParam_Arr(selectUsageQuery, [user_idx, month_int_past, month_int_today]);

        if (!selectUsageResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : Select Error"
            });
        } else {
            let pastData = selectUsageResult[0].use_elec;
            let presentData = selectUsageResult[1].use_elec;
            let usageData = new Object();

            usageData.elec = await calc.percentage(pastData, presentData);
            //console.log(usageData.elec);

            pastData = selectUsageResult[0].use_water;
            presentData = selectUsageResult[1].use_water;

            usageData.water = await calc.percentage(pastData, presentData);
            //console.log(usageData.water);

            pastData = selectUsageResult[0].use_gas;
            presentData = selectUsageResult[1].use_gas;

            usageData.gas = await calc.percentage(pastData, presentData);
            //console.log(usageData.gas);

            //기간별 탄소 배출량 구하기
            let selectJoinDateQuery = 'SELECT user_join_date FROM User WHERE user_idx = ?';
            let selectJoinDateResult = await db.queryParam_Arr(selectJoinDateQuery, [user_idx]);

            let user_join_date = selectJoinDateResult[0].user_join_date;    //사용자가 가입한 달
            let user_join_month = user_join_date.getMonth() + 1;

            console.log("user_join_month : " + user_join_month);


            let max_month = user_join_month + 6;
            if (max_month > 12) {
                max_month -= 12;
            }

            let min = user_join_month;
            let max = max_month;

            
            if (user_join_month > max_month) {
                min = max_month;
                max = user_join_month;
            }

            console.log("min : " + min + ", max : " + max);

            
            let totalCarbonResult = new Array();
            let pastTotalCarbonResult = new Array();
            let totalCarbon = 0;
            let pastTotalCarbon = 0;
            let i = 0;
            let j = 0;
            let pastMax = 0;    //전영도 구할 때 반복문을 어디까지 돌릴지
            let term = new Array();
            let standard_month = today_month - 1;
            if (standard_month < 1) {
                standard_month = 12;
            }

            console.log("standard_month : " + standard_month);
            if ((1 <= standard_month) && (standard_month < min)) {    //해가 넘거감
                i = ((toady_year - 1) - 2000) * 12 + max;
                j = ((toady_year - 2) - 2000) * 12 + max;
                term[0] = max;
                term[1] = min;
                pastMax = (toady_year - 1 - 2000) * 12 + min;
            }else if ((min <= standard_month) && (standard_month < max)) {
                i = (toady_year - 2000) * 12 + min;
                j = ((toady_year - 1) - 2000) * 12 + min;
                term[0] = min;
                term[1] = max;
                pastMax = ((toady_year - 1) - 2000) * 12 + max;
            } else if ((max <= standard_month) && (standard_month <= 12)) {
                i = (toady_year - 2000) * 12 + max;
                j = ((toady_year - 1) - 2000) * 12 + max;
                term[0] = max;
                term[1] = min;
                pastMax = (toady_year - 2000) * 12 + min;
            } else {
                i = 0;
                j = 0;
            }

            console.log("falg_month_int : " + i + ", past_flag : " + j + ", today : " + today + ", past : " + past + ", pastMax : " + pastMax);

            for (; i < today; i++) {
                let selectMonthQuery = 'SELECT use_carbon FROM eco.Usage WHERE user_idx = ? and use_month_int = ?';
                let selectMonthResult = await db.queryParam_Arr(selectMonthQuery, [user_idx, i]);

                console.log(selectMonthResult);

                totalCarbon += parseInt(selectMonthResult[0].use_carbon);
                totalCarbonResult.push(selectMonthResult[0].use_carbon);                   
            }
            console.log();
            for (; j < pastMax; j++) {
                let selectMonthQuery = 'SELECT use_carbon FROM eco.Usage WHERE user_idx = ? and use_month_int = ?';
                let selectMonthResult = await db.queryParam_Arr(selectMonthQuery, [user_idx, j]);

                console.log(selectMonthResult);

                if (j < past) {
                    pastTotalCarbon += parseInt(selectMonthResult[0].use_carbon);
                }
                pastTotalCarbonResult.push(selectMonthResult[0].use_carbon); 
            }
            console.log("total : " + totalCarbon + " / " + pastTotalCarbon)
            usageData.carbon = await calc.percentage(totalCarbon, pastTotalCarbon);

            //바코드와 보유 마일리지 보여주기
            let selectUserInfoQuery = 'SELECT user_barcodenum, user_mileage FROM eco.User WHERE user_idx = ?';
            let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [user_idx]);

            if (!totalCarbonResult || !selectUserInfoResult) {
                res.status(500).send({
                    message : "Invail Server Error : Get Data"
                });
            } else {
                res.status(200).send({
                    term : term,
                    carbon : totalCarbonResult,
                    totalCarbon : totalCarbon,
                    pastCarbon : pastTotalCarbonResult,
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
