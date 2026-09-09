const express = require("express");

const { getDashboard,
        createUser,
        getUsers,
        getUserById,
        createStore,
        getStores
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("SYSTEM_ADMIN"),
    getDashboard
);


router.post(
    "/users",
    authenticateToken,
    authorizeRoles("SYSTEM_ADMIN"),
    createUser
);

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("SYSTEM_ADMIN"),
    getUsers
);

router.get(
    "/users/:id",
    authenticateToken,
    authorizeRoles("SYSTEM_ADMIN"),
    getUserById
);

router.post(
    "/stores",
    authenticateToken,
    authorizeRoles("SYSTEM_ADMIN"),
    createStore
);
router.get(
  "/stores",
  authenticateToken,
  authorizeRoles("SYSTEM_ADMIN"),
  getStores
);

module.exports = router;