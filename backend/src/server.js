require("dotenv").config();

console.log("SERVER FILE STARTED");

const app = require("./app");
const sequelize = require("./config/database");

require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection established successfully.");

    await sequelize.sync();

    console.log("Database tables synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:");
    console.error(error);
  }
};

startServer();