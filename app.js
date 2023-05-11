const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurent");

const exphbs = require("express-handlebars");
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

app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restList) => res.render("index", { restList }))
    .catch((error) => console.log(error));
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findById(id)
    .lean()
    .then((restDetail) => res.render("restDetail", { restDetail }))
    .catch((error) => console.loeg(error));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
