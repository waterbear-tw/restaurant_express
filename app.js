const express = require("express");
const app = express();
const mongoose = require("mongoose");
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", () => console.log(" MongoDB connection error occurs!"));
db.once("open", () => console.log("MongoDB connect successfully."));

app.get("/", (req, res) => {
  res.send("hi.");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
