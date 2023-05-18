const db = require("../../config/mongoose");
//載入json作為種子檔案
const restaurantJson = require("/Users/popo/ac-excercise/restaurant_express/restaurant.json");
const restaurantList = restaurantJson.results;
db.once("open", () => {
  console.log("mongodb works successfully in seeder.");
  restaurantList.forEach((restaurant) => {
    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description,
    });
  });
  console.log("seeder is done!");
});
