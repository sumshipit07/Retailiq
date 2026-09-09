const express = require("express");

const {
    getStores,
    changePassword,
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


const router = express.Router();

router.get(
    "/stores",
    authenticateToken,
    authorizeRoles("NORMAL_USER"),
    getStores
);

router.put(
    "/change-password",
    authenticateToken,
    authorizeRoles("NORMAL_USER"),
    changePassword
);
module.exports = router;