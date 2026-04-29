const express = require("express");
const bookingRateLimiter = require("../middleware/rateLimiter");
const bookingService = require("../services/bookingService");

const router = express.Router();

router.post("/book", bookingRateLimiter, async (req, res, next) => {
  try {
    const { userId, seatId, showId } = req.body;

    if (![userId, seatId, showId].every((value) => Number.isInteger(value) && value > 0)) {
      return res.status(400).json({
        success: false,
        error: "userId, seatId, and showId must be positive integers",
      });
    }

    const booking = await bookingService.createBooking({
      userId,
      seatId,
      showId,
    });

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    if (error.code === "DUPLICATE_BOOKING") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    return next(error);
  }
});

module.exports = router;
