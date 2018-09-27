const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.loadFromPath('./config/aws_config.json');
const upload = require('../../config/multer.js');

router.post('/', upload.single('goods_img'), async (req, res) => {
    let goods_name = req.body.goods_name;
    let goods_price = parseInt(req.body.goods_price);
    let goods_content = req.body.goods_content
    let goods_img = null;

    if (req.file != undefined) {
        goods_img = req.file.location;
    }

    if (!goods_name || !goods_price) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let insertGoodsQuery = 'INSERT INTO eco.shop (goods_name, goods_price, goods_content, goods_img) VALUES (?, ?, ?, ?)';
        let insertGoodsResult = await db.queryParam_Arr(insertGoodsQuery, [goods_name, goods_price, goods_content, goods_img]);

        if (!insertGoodsResult) {
            res.status(500).send({
                message : "Interna Server Error : Insert Goods"
            });
        } else {
            res.status(200).send({
                message : "Successfully Insert Goods"
            })
        }
    }
});

module.exports = router;
