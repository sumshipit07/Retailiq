const { User, Store, Rating } = require("../models");

const { fn, col } = require("sequelize");

const {
    comparePassword,
    hashPassword,
} = require("../services/authService");

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find the store owned by the logged-in user
        const store = await Store.findOne({
            where: {
                ownerId: ownerId,
            },
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "No store is assigned to this owner.",
            });
        }

        // Get all ratings for this store
        // Also get the user who submitted each rating
        const ratings = await Rating.findAll({
            where: {
                storeId: store.id,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        // Calculate the average rating
        const averageRating = await Rating.findOne({
            where: {
                storeId: store.id,
            },
            attributes: [
                [fn("COALESCE", fn("AVG", col("rating")), 0), "averageRating"],
            ],
            raw: true,
        });

        // Return the owner's dashboard data
        return res.status(200).json({
            success: true,
            data: {
                store: {
                    id: store.id,
                    name: store.name,
                    email: store.email,
                    address: store.address,
                },
                averageRating: Number(averageRating.averageRating),
                ratings: ratings.map((rating) => ({
                    id: rating.id,
                    rating: rating.rating,
                    user: rating.user,
                    createdAt: rating.createdAt,
                    updatedAt: rating.updatedAt,
                })),
            },
        });
    } catch (error) {
        console.error("Owner dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to load owner dashboard.",
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required.",
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isCurrentPasswordValid = await comparePassword(
            currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        console.error("Owner change password error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboard,
    changePassword,
};