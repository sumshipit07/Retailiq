const express = require("express");

const {
  createOrUpdateRating,
} = require("../controllers/ratingController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("NORMAL_USER"),
  createOrUpdateRating
);

module.exports = router;