const express = require("express");
const router = express.Router();

//引用Restaurant model
const Restaurant = require("../../models/restaurant");

//路由設定：index頁面
router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restList) => res.render("index", { restList }))
    .catch((error) => console.log(error));
});

module.exports = router;
