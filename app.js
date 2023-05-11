const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");

const exphbs = require("express-handlebars");
const restaurant = require("./restaurant.json");
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

//路由設定：index頁面
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restList) => res.render("index", { restList }))
    .catch((error) => console.log(error));
});
//路由設定：特定餐廳頁面
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restDetail) => res.render("restDetail", { restDetail }))
    .catch((error) => console.loeg(error));
});
//路由設定：搜尋結果
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  return Restaurant.find() //用資料庫中的餐廳清單來篩選出搜尋結果
    .lean()
    .then((restaurantList) => {
      const filteredList = restaurantList.filter((rest) =>
        rest.name.toLowerCase().includes(keyword.toLocaleLowerCase())
      );
      res.render("index", { restList: filteredList, keyword });
    })
    .catch((error) => console.log("cannot get data while searching!", error));
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
