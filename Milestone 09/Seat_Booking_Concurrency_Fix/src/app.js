const express = require("express");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(express.json());
app.use(bookingRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

module.exports = app;
