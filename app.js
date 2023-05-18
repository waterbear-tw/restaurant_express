const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
//載入body-parser解析新增餐廳的表單資料
const bodyParser = require("body-parser");

const exphbs = require("express-handlebars");

const methodOverride = require("method-override");

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", () => console.log(" MongoDB connection error occurs!"));
db.once("open", () => console.log("MongoDB connect successfully."));

//設定body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//設定先經過method-override處理
app.use(methodOverride("_method"));

//路由設定：index頁面
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restList) => res.render("index", { restList }))
    .catch((error) => console.log(error));
});
app.get("/restaurants", (req, res) => {
  app.redirect("/");
});

//路由設定：搜尋結果
app.get("/restaurants/search", (req, res) => {
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
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});
////提交新餐廳的表單，並加入到資料庫
app.post("/restaurants/new", (req, res) => {
  const newRestData = req.body;
  return Restaurant.create(newRestData)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//路由設定：特定餐廳頁面
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restDetail) => res.render("restDetail", { restDetail }))
    .catch((error) => console.log(error));
});

//路由設定：刪除餐廳資料
app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.deleteOne(); //mongoose更新後採用deleteOne()而非remove()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//路由設定：編輯餐廳資訊
app.get("/restaurants/edit/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});
////變更資料庫中的餐廳資料
app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const updatedRestaurant = req.body;
  Restaurant.findById(id)
    .then((restaurant) => {
      const keys = Object.keys(updatedRestaurant);

      //將新資料的值帶入舊資料中
      keys.forEach((key) => (restaurant[key] = updatedRestaurant[key]));
      restaurant.save();
      res.redirect(`/restaurants/${restaurant._id}`);
    })
    .catch((error) => console.log(error));
});

//啟動伺服器
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
