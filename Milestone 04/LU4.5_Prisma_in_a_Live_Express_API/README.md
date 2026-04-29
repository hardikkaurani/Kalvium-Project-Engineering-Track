# OrderFlow API Stabilization

This challenge hardens a fragile e-commerce backend into a production-grade Node.js + Express + Prisma API.

## What Was Fixed

- Replaced raw SQL access with Prisma model queries
- Added a singleton Prisma client in `lib/prisma.js`
- Added null-safe 404 handling for single-record fetches
- Added transaction-safe checkout with stock validation
- Added inventory tracking with `Product.stock`

## Files

- `prisma/schema.prisma`
- `lib/prisma.js`
- `controllers/productController.js`
- `controllers/orderController.js`
- `routes/productRoutes.js`
- `routes/orderRoutes.js`
- `app.js`
- `server.js`
- `package.json`

## Run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name add_stock_and_orderflow_hardening
npm run dev
```
