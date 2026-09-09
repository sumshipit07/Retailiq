const { Rating, Store } = require("../models");

const createOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    // Validate required fields
    if (!storeId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Store ID and rating are required.",
      });
    }

    // Validate rating range
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
    }

    // Check whether store exists
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    // Check whether user already rated this store
    const existingRating = await Rating.findOne({
      where: {
        userId,
        storeId,
      },
    });

    if (existingRating) {
      existingRating.rating = Number(rating);
      await existingRating.save();

      return res.status(200).json({
        success: true,
        message: "Rating updated successfully.",
        data: existingRating,
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      userId,
      storeId,
      rating: Number(rating),
    });

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully.",
      data: newRating,
    });
  } catch (error) {
    console.error("Create/update rating error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit rating.",
    });
  }
};

module.exports = {
  createOrUpdateRating,
};