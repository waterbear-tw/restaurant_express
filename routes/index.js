//引用express及express 路由器
const express = require("express");
const router = express.Router();
//準備引入路由模組們
const hone = require("./modules/home");
const restaurants = require("./modules/restaurants");
router.use("/", hone);
router.use("/restaurants", restaurants);

//匯出路由模組
module.exports = router;
