const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const moment = require('moment');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    let selectUsageQuery = 'SELECT * FROM eco.Usage WHERE user_idx = ?';
    let selectUsageResult = await db.queryParam_Arr(selectUsageQuery, [user_idx]);

    if (!selectUsageResult) {
        res.status(500).send({
            message : "Invaild Server Error : Select Usage"
        });
    } else {
        for (let i = 0; i < selectUsageResult.length; i++) {
            let usage_idx = selectUsageResult[i].usage_idx;
            let elec = parseInt(selectUsageResult[i].use_elec);
            let water = parseInt(selectUsageResult[i].use_water);
            let gas = parseInt(selectUsageResult[i].use_gas);

            let carbon = Math.round((elec * 0.465) + (water * 0.66) + (gas * 2.24));

            let updateCarbonQuery = 'UPDATE eco.Usage SET use_carbon = ? WHERE usage_idx = ?';
            let updateCarbonResult = await db.queryParam_Arr(updateCarbonQuery, [carbon, usage_idx]);

            if (!updateCarbonResult) {
                console.log("usage idx " + usage_idx + "update error");
            }
        }

        res.status(200).send({
            message : "Successfully Update Carbon Data"
        });
    }
});
module.exports = router;