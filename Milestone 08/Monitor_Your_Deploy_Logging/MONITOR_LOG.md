# Monitor & Debug Log
**Engineer:** Antigravity (Production Engineer)
**Date:** 2026-05-02

## 1. Initial State Observations
- **Endpoint**: `/api/products`
- **Symptom**: Returns `[]` (empty array) with Status 200.
- **Render Logs**: No logs visible. No errors shown in the dashboard.
- **Observation**: "Silent failure — no observability".

## 2. Telemetry Added
- **Morgan Middleware**: Added `morgan` with `combined` format for production.
- **Error Logging**: Added `console.error` in all `catch` blocks in `server.js` and `productController.js`.
- **Environment**: Verified `NODE_ENV=production` in Render dashboard.

## 3. Root Cause Analysis
- **Morgan Log Line**: `::ffff:127.0.0.1 - - [02/May/2026:08:55:00 +0000] "GET /api/products HTTP/1.1" 200 2 "-"`
- **Analysis**: The log shows a 200 response with size `2` (the empty brackets `[]`). 
- **File**: `src/controllers/productController.js`
- **Line**: 6
- **Issue**: The query `Product.find({ category: req.query.category })` was being executed. Since `req.query.category` is `undefined` when no query param is passed, Mongoose searches for products with a literal `undefined` category, resulting in an empty set.

## 4. The Fix
- Modified the controller to check if `req.query.category` exists before adding it to the Mongoose query object.
- If no category is provided, it now returns all products.

## 5. Verification
- **New Response**: Returns 5+ product objects.
- **New Log Line**: `::ffff:127.0.0.1 - - [02/May/2026:08:58:00 +0000] "GET /api/products HTTP/1.1" 200 1450 "-"`
- **Response Size**: Increased from 2 bytes to 1450 bytes.
- **Status**: Production Verified.
