const { User, Store, Rating } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const { hashPassword } = require("../services/authService");

const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings,
            },
        });
    } catch (error) {
        console.error("Admin dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard.",
        });
    }
};

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role,
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required.",
            });
        }

        const allowedRoles = [
            "SYSTEM_ADMIN",
            "NORMAL_USER",
            "STORE_OWNER",
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Admin can only create SYSTEM_ADMIN or NORMAL_USER.",
            });
        }

        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered.",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Create user error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { name, email, address, role } = req.query;

        const { sortBy, order = "DESC" } = req.query;

        const allowedSortFields = [
            "name",
            "email",
            "address",
            "role",
            "createdAt"
        ];

        const allowedOrderValues = ["ASC", "DESC"];

        const normalizedOrder = order.toUpperCase();

        if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort field.",
            });
        }

        if (!allowedOrderValues.includes(normalizedOrder)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort order. Use ASC or DESC.",
            });
        }

        const where = {};

        if (name) {
            where.name = {
                [Op.iLike]: `%${name}%`,
            };
        }

        if (email) {
            where.email = {
                [Op.iLike]: `%${email}%`,
            };
        }

        if (address) {
            where.address = {
                [Op.iLike]: `%${address}%`,
            };
        }

        if (role) {
            where.role = role;
        }

        const users = await User.findAll({
            where,

            attributes: [
                "id",
                "name",
                "email",
                "address",
                "role",
                "createdAt",
            ],

            order: [[sortBy || "createdAt", normalizedOrder]],
        });

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Get users error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load users.",
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: [
                "id",
                "name",
                "email",
                "address",
                "role",
                "createdAt",
                "updatedAt",
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const userData = user.toJSON();

        if (user.role === "STORE_OWNER") {
            const stores = await Store.findAll({
                where: { ownerId: user.id },
                attributes: [
                    "id",
                    "name",
                    "email",
                    "address",
                    [
                        fn("COALESCE", fn("AVG", col("ratings.rating")), 0),
                        "overallRating",
                    ],
                ],
                include: [
                    {
                        model: Rating,
                        as: "ratings",
                        attributes: [],
                        required: false,
                    },
                ],
                group: ["Store.id"],
            });

            userData.store = stores[0] || null;
        }

        return res.status(200).json({
            success: true,
            data: userData,
        });
    } catch (error) {
        console.error("Get user by id error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load user details.",
        });
    }
};


const getStores = async (req, res) => {
    try {
        const { name, email, address, sortBy, order = "ASC" } = req.query;
        const allowedSortFields = [
            "name",
            "email",
            "address",
            "overallRating",
            "createdAt",
        ];

        const allowedOrderValues = ["ASC", "DESC"];

        if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort field.",
            });
        }
        const normalizedOrder = order.toUpperCase();

        if (!allowedOrderValues.includes(normalizedOrder)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort order. Use ASC or DESC.",
            });
        }

        const where = {};

        if (name) {
            where.name = {
                [Op.iLike]: `%${name}%`,
            };
        }

        if (email) {
            where.email = {
                [Op.iLike]: `%${email}%`,
            };
        }

        if (address) {
            where.address = {
                [Op.iLike]: `%${address}%`,
            };
        }
        const stores = await Store.findAll({
            where,


            attributes: [
                "id",
                "name",
                "email",
                "address",
                [
                    fn("COALESCE", fn("AVG", col("ratings.rating")), 0),
                    "overallRating",
                ],
            ],

            include: [
                {
                    model: Rating,
                    as: "ratings",
                    attributes: [],
                    required: false,
                },
            ],

            group: ["Store.id"],

            order: sortBy === "overallRating"
                ? [[literal('"overallRating"'), normalizedOrder]]
                : [[sortBy || "name", normalizedOrder]],
        });

        return res.status(200).json({
            success: true,
            data: stores,
        });
    } catch (error) {
        console.error("Get stores error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load stores.",
        });
    }
};


const createStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        // Check required fields
        if (!name || !email || !address) {
            return res.status(400).json({
                success: false,
                message: "Name, email and address are required.",
            });
        }

        // If ownerId is provided, verify the owner
        if (ownerId) {
            const owner = await User.findByPk(ownerId);

            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: "Store owner not found.",
                });
            }

            if (owner.role !== "STORE_OWNER") {
                return res.status(400).json({
                    success: false,
                    message: "Selected user is not a Store Owner.",
                });
            }
        }

        // Create store
        const store = await Store.create({
            name,
            email,
            address,
            ownerId: ownerId || null,
        });

        return res.status(201).json({
            success: true,
            message: "Store created successfully.",
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                ownerId: store.ownerId,
            },
        });
    } catch (error) {
        console.error("Create store error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create store.",
        });
    }
};

module.exports = {
    getDashboard,
    createUser,
    getUsers,
    getUserById,
    createStore,
    getStores,
};