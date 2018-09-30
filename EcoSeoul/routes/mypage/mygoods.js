const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:user_idx', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!user_idx) {
        res.status(400).send({
            message : "Null Value : user index"
        });
    } else {
        let selectGoodsQuery = 'SELECT s.goods_name, s.goods_img, m.mileage_withdraw, m.mileage_date, m.mileage_usage FROM shop s JOIN Mileage m ON s.goods_idx = m.goods_idx WHERE m.user_idx = ? ORDER BY m.mileage_date DESC';
        let selectGoodsResult = await db.queryParam_Arr(selectGoodsQuery, [user_idx]);

        if (!selectGoodsResult) {
            res.status(500).send({
                message : "Internal Server Error : select goods"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Goods Data",
                myGoods : selectGoodsResult
            });
        }
    }
});


module.exports = router;
