const express = require("express");

const {
    getDashboard,
    changePassword,
} = require("../controllers/ownerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("STORE_OWNER"),
    getDashboard
);

router.put(
    "/change-password",
    authenticateToken,
    authorizeRoles("STORE_OWNER"),
    changePassword
);

module.exports = router;