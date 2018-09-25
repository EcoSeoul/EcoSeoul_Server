const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!user_idx) {
        res.status(400).send({
            status : "false",
            message : "Null Value : user index"
        });
    } else {
        let selectMileageQuery = 'SELECT user_mileage FROM User WHERE user_idx = ?';
        let selectMileageResult = await db.queryParam_Arr(selectMileageQuery, [user_idx]);

        let selectDonationsQuery = 'SELECT o.org_name, m.mileage_withdraw, m.mileage_date FROM Organization as o JOIN Mileage as m ON o.org_idx = m.org_idx WHERE m.user_idx = ?';
        let selectDonationsResult = await db.queryParam_Arr(selectDonationsQuery, [user_idx]);

        if (!selectDonationsResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : Select Organizations"
            });
        } else {
            res.status(200).send({
                status : "true",
                message : "Successfully Get Organizations Data",
                myTotalMileage : selectMileageResult[0].user_mileage,
                myDonations : selectDonationsResult
            });
        }
    }
});


module.exports = router;
