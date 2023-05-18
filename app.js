const express = require("express");
const app = express();
const mongoose = require("mongoose");
//引入路由器
const routes = require("./routes");

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

//使用路由器
app.use(routes);

//啟動伺服器
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
