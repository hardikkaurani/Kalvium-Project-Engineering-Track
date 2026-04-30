# Seat Booking Concurrency Fix

This challenge hardens a seat booking API against duplicate concurrent bookings and request flooding.

## Files

- `prisma/schema.prisma`
- `src/middleware/rateLimiter.js`
- `src/services/bookingService.js`
- `src/routes/bookings.js`
- `src/lib/prisma.js`
- `src/app.js`
- `server.js`

## Behavior

- First booking succeeds with `201 Created`
- Duplicate booking for the same `seatId` and `showId` returns `409 Conflict`
- More than 10 booking requests per minute from the same IP returns `429 Too Many Requests`
