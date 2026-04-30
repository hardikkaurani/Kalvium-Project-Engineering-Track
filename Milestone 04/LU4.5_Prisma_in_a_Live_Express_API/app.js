const express = require("express");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Unique constraint violation" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
