const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) =>{
    let user_idx = req.body.user_idx;
    let user_barcodenum = req.body.user_barcodenum; //string 값

    if (!user_idx || !user_barcodenum) {
        res.status(400).send({
            status : "false",
            message : "Null value : user index and barcodenum"
        });
    } else {
        let insertBarcodeNumQuery = 'UPDATE User SET user_barcoenum = ? WHERE user_idx = ?';
        let insertBarcodeNumResult = await db.queryParam_Arr(insertBarcodeNumQuery, [user_barcodenum, user_idx]);

        if (insertBarcodeNumResult) {
            res.status(500).send({
                status : "false", 
                message : "Internal Server Error : Insert BarcodeNum"
            });
        } else {
            res.status(200).send({
                status : "true",
                message : "Successfully Insert BarcodeNumber"
            });
        }
    }
});


module.exports = router;
