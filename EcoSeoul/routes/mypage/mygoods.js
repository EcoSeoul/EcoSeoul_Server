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
        let selectGoodsQuery = 'SELECT s.goods_name, m.mileage_withdraw, m.milage_date, m.milage_usage FROM shop s JOIN milage m ON s.goods_idx = m.goods_idx WHERE m.user_idx = ? and m.org_idx = ?';
        let selectGoodsResult = await db.queryParam_Arr(selectGoodsQuery, [user_idx, null]);

        if (!selectGoodsResult) {
            res.status(500).send({
                status : "false",
                message : "Internal Server Error : select goods"
            });
        } else {
            res.status(200).send({
                status : "true",
                message : "Successfully Get Goods Data",
                myGoods : selectGoodsResult
            });
        }
    }
});


module.exports = router;
