const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Optimized Score Route
router.get('/', async (req, res) => {
  try {
    // FIX 1: Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    // FIX 2: Over-fetching (Selectively fetching fields to reduce payload)
    // EXCLUDES: strategyNote (heavy data)
    const [scores, total] = await Promise.all([
      prisma.score.findMany({
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          game: true,
          player: true,
          score: true,
          date: true,
          // strategyNote is intentionally omitted to optimize payload
        }
      }),
      prisma.score.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: scores,
      metadata: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Performance Audit Error:', error);
    res.status(500).json({ error: 'Failed to fetch optimized score list' });
  }
});

module.exports = router;
