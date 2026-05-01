const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

// Initialize environment variables as early as possible
dotenv.config();

/**
 * TASK 4: FAIL-FAST VALIDATION
 * Checks for critical environment variables before starting the server.
 * Prevents "silent failures" where the app runs but database or auth fails later.
 */
function validateEnv() {
  const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("FATAL ERROR: Missing required environment variables:", missing.join(", "));
    console.error("The application cannot start without these configurations.");
    process.exit(1);
  }
  console.log("?? Environment validation successful.");
}

// Perform validation before mounting middleware or starting the server
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "NoteVault API",
    version: "1.0.0",
    status: "Secure",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// Start the server only if validation passed
app.listen(PORT, () => {
  console.log(`?? NoteVault API running on port ${PORT}`);
});
