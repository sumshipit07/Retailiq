require("dotenv").config();

const sequelize = require("./config/database");
const { User } = require("./models");
const { hashPassword } = require("./services/authService");

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection established.");

    const existingAdmin = await User.findOne({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("An account with this email already exists.");

      await sequelize.close();
      return;
    }

    const hashedPassword = await hashPassword(
      process.env.ADMIN_PASSWORD
    );

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "SYSTEM_ADMIN",
    });

    console.log("System Administrator created successfully.");
    console.log(`Admin ID: ${admin.id}`);
    console.log(`Admin Email: ${admin.email}`);
    console.log(`Admin Role: ${admin.role}`);

    await sequelize.close();
  } catch (error) {
    console.error("Failed to create System Administrator:");
    console.error(error.message);

    await sequelize.close();
  }
};

seedAdmin();