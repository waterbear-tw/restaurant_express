const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
//引入路由器
const routes = require("./routes");

//載入body-parser解析新增餐廳的表單資料
const bodyParser = require("body-parser");

//引入套件使路由符合RESTful風格
const methodOverride = require("method-override");

//設定exphbs
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

//載入mongoose連線mongoDB
require("./config/mongoose");

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
