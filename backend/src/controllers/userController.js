const { User, Store, Rating } = require("../models");

const { Op, fn, col } = require("sequelize");

const {
    comparePassword,
    hashPassword,
} = require("../services/authService");


const getStores = async (req, res) => {
    try {
        const { name, address } = req.query;

        const where = {};

        if (name) {
            where.name = {
                [Op.iLike]: `%${name}%`,
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
                    fn(
                        "COALESCE",
                        fn("AVG", col("ratings.rating")),
                        0
                    ),
                    "overallRating",
                ],
            ],

            include: [
                {
                    model: Rating,
                    as: "ratings",
                    attributes: ["userId", "rating"],
                    required: false,
                },
            ],

            group: ["Store.id", "ratings.id"],

            order: [["name", "ASC"]],
        });

        const userId = req.user.id;

        const result = stores.map((store) => {
            const storeData = store.toJSON();

            const userRating = storeData.ratings?.find(
                (rating) => rating.userId === userId
            );

            return {
                id: storeData.id,
                name: storeData.name,
                email: storeData.email,
                address: storeData.address,
                overallRating: Number(storeData.overallRating),
                userRating: userRating
                    ? userRating.rating
                    : null,
            };
        });

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error(
            "Get user stores error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load stores.",
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required.",
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isCurrentPasswordValid =
            await comparePassword(
                currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        const hashedPassword =
            await hashPassword(newPassword);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });

    } catch (error) {
        console.error(
            "Change password error:",
            error.message
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    getStores,
    changePassword,
};