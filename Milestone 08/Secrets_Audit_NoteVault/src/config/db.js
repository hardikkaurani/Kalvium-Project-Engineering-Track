const { PrismaClient } = require("@prisma/client");

// FIX: Removed hardcoded connection string. 
// Now reads from process.env.DATABASE_URL which is injected at runtime.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = prisma;
