const express = require("express");

const {
  signup,
  login,
  getMe,
  getAdminTest,
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticateToken, getMe);

router.get(
  "/admin-test",
  authenticateToken,
  authorizeRoles("SYSTEM_ADMIN"),
  getAdminTest
);

module.exports = router;