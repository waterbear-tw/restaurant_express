const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

//路由設定 重導回主頁
router.get("/", (req, res) => {
  res.redirect("/");
});

//路由設定：搜尋結果
router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  return Restaurant.find() //用資料庫中的餐廳清單來篩選出搜尋結果
    .lean()
    .then((restaurantList) => {
      const filteredList = restaurantList.filter((rest) =>
        rest.name.toLowerCase().includes(keyword.toLowerCase())
      );
      res.render("index", { restList: filteredList, keyword });
    })
    .catch((error) => console.log("cannot get data while searching!", error));
});

//路由設定： 新增一間餐廳
router.get("/new", (req, res) => {
  res.render("new");
});
////提交新餐廳的表單，並加入到資料庫
router.post("/new", (req, res) => {
  const newRestData = req.body;
  return Restaurant.create(newRestData)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//路由設定：特定餐廳頁面
router.get("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restDetail) => res.render("restDetail", { restDetail }))
    .catch((error) => console.log(error));
});

//路由設定：刪除餐廳資料
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.deleteOne(); //mongoose更新後採用deleteOne()而非remove()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//路由設定：編輯餐廳資訊
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});
////變更資料庫中的餐廳資料
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedRestaurant = req.body;
  Restaurant.findById(id)
    .then((restaurant) => {
      const keys = Object.keys(updatedRestaurant);

      //將新資料的值帶入舊資料中
      keys.forEach((key) => (restaurant[key] = updatedRestaurant[key]));
      restaurant.save();
      res.redirect(`/${restaurant._id}`);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
