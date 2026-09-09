const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validatePassword = (password) => {
  if (typeof password !== "string") {
    throw new Error("Password is required.");
  }

  if (password.length < 8 || password.length > 16) {
    throw new Error("Password must be between 8 and 16 characters.");
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase || !hasSpecialCharacter) {
    throw new Error(
      "Password must contain at least one uppercase letter and one special character."
    );
  }

  return true;
};

const hashPassword = async (password) => {
  validatePassword(password);

  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = {
  validatePassword,
  hashPassword,
  comparePassword,
  generateToken,
};