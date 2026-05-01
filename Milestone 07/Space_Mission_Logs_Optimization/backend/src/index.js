const express = require('express');
const cors = require('cors');
const compression = require('compression'); // FIX 4: Compression
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(compression()); // FIX 4: Enable compression globally
app.use(cors());
app.use(express.json());

// OPTIMIZED ENDPOINT: Handles N+1, Pagination, and Payload Reduction
app.get('/api/missions', async (req, res) => {
  console.log('--- GET /api/missions called (Optimized) ---');
  
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    // FIX 1 & 3: Single optimized query with selective fields (Payload Reduction)
    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        skip,
        take: limit,
        orderBy: { launchDate: 'desc' },
        select: {
          id: true,
          name: true,
          launchDate: true,
          rocket: true,
          status: true,
          // FIX 1: Fetch related data in the same query (No N+1)
          crew: {
            select: {
              name: true,
              role: true
            }
          },
          logs: {
            select: {
              id: true,
              timestamp: true,
              event: true
            }
          }
        }
      }),
      prisma.mission.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    // FIX 2: Return detailed pagination metadata
    res.json({
      data: missions,
      metadata: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Performance Error:', error);
    res.status(500).json({ error: 'Failed to fetch missions with optimization' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Optimized Space Mission Server running on http://localhost:${PORT}`);
});
