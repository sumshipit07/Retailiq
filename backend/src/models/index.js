const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// User → Store
User.hasOne(Store, {
  foreignKey: "ownerId",
  as: "store",
});

Store.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

// User → Ratings
User.hasMany(Rating, {
  foreignKey: "userId",
  as: "ratings",
});

Rating.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Store → Ratings
Store.hasMany(Rating, {
  foreignKey: "storeId",
  as: "ratings",
});

Rating.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});

module.exports = {
  User,
  Store,
  Rating,
};